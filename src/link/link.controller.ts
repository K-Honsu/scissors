import linkModel from "../models/link";
import userModel from "../models/user";
import randomstring from "randomstring"
// import { MyCache } from "../utils/Cache/Redis/index";
import { MyCache } from "../utils/Cache/Redis";
import { client } from "../utils/Cache/Redis/index1";
import fs from "fs"
import QRCode from 'qrcode'
import { uploadToCloudinary } from "../utils/Cloudinary/cloudinary";
import e, { Request, Response } from "express";

interface RequestQuery {
    descriptionQ?: string;
}

const createLinkForUnautheticatedUser = async (req: Request, res: Response) => {
    try {
        let { url, alias } = req.body
        if (!alias) {
            alias = randomstring.generate({
                length: 6,
                charset: "alphabetic",
            })
        }
        const linkExists = await linkModel.findOne({ alias }).exec()
        if (linkExists) return res.status(403).json({
            status: false,
            message: `Sorry, the alias (${alias}) has already been used`
        })
        if (!url.startsWith('https://')) {
            url = 'https://' + url;
        }
        // Create the link
        const link = await linkModel.create({ url, alias });
        const baseUrl = req.protocol + '://' + req.get('host');
        const linkUrl = alias ? `${baseUrl}/${alias}` : `${baseUrl}/${randomstring.generate(6)}`;
        return res.status(201).json({
            status: true,
            message: "Link created succesfully",
            data: { linkUrl, link }
        })
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const createLink = async (req: Request, res: Response) => {
    try {
        let { url, description, alias } = req.body
        const foundUser = await userModel.findById({ _id: req.user._id })
        if (!foundUser) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }
        if (!alias) {
            alias = randomstring.generate({
                length: 6,
                charset: "alphabetic",
            })
        }
        // Check to see if link exists
        const linkExists = await linkModel.findOne({ alias }).exec()
        if (linkExists) return res.status(403).json({
            status: false,
            message: `Sorry, the alias (${alias}) has already been used`
        })
        if (!url.startsWith('https://')) {
            url = 'https://' + url;
        }
        // Create the link
        const link = await linkModel.create({ url, description, alias, createdBy: foundUser._id });
        foundUser.links.push(link.id);
        await foundUser.save();
        const baseUrl = req.protocol + '://' + req.get('host');
        const linkUrl = alias ? `${baseUrl}/${alias}` : `${baseUrl}/${randomstring.generate(6)}`;
        return res.status(201).json({
            status: true,
            message: "Link created succesfully",
            data: { linkUrl, link }
        })
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const getLinks = async (req: Request<{}, {}, {}, RequestQuery>, res: Response) => {
    let isCached: boolean = false
    try {
        const userId: string = req.user._id;
        const { descriptionQ } = req.query;
        const query = { createdBy: userId };

        if (descriptionQ) {
            // @ts-ignore
            query['description'] = { $regex: descriptionQ, $options: 'i' };
        }

        // Check if the response is already cached
        // const cacheResults = await client.get(userId.toString());
        const cacheResults: any = await client.getKey(userId.toString())

        if (cacheResults) {
            const data = JSON.parse(cacheResults);
            return res.status(200).json({
                fromCache: true,
                status: true,
                message: "Links retrieved from cache successfully",
                data: data
            });
        } else {

            // If the response is not cached, fetch it from the database
            const userLinks = await linkModel.find(query).lean().exec();
            const baseUrl = req.protocol + '://' + req.get('host');
            const links = userLinks.map((link: any) => {
                return {
                    id: link?._id,
                    url: link?.url,
                    description: link?.description,
                    alias: `${baseUrl}/${link.alias}`,
                    created_at: link?.createdAt
                };
            });

            // Cache the response
            // await client.set(userId.toString(), JSON.stringify(links));
            await client.setKey(userId.toString(), JSON.stringify(links))

            // Return the data from the server
            return res.status(200).json({
                fromCache: false,
                status: true,
                message: `Links for user ${userId} retrieved from the server`,
                data: links
            });
        }

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

const generateQR = async (req: Request, res: Response) => {
    try {
        const { alias } = req.params;
        const existingLink = await linkModel.findOne({ alias }).exec();
        if (!existingLink) return res.status(404).json({
            status: false,
            message: "Link alias not found"
        });

        const { url } = existingLink;
        const qrCodeFilePath = `./${alias}.png`;
        await QRCode.toFile(qrCodeFilePath, url);

        const cloudinaryUrl = await uploadToCloudinary({
            buffer: fs.readFileSync(qrCodeFilePath)
        });

        existingLink.path = cloudinaryUrl;
        existingLink.cloudinaryId = "heyo"
        await existingLink.save();

        fs.unlinkSync(qrCodeFilePath)

        return res.status(200).json({
            status: true,
            message: "QR code generated and uploaded to Cloudinary",
            data: cloudinaryUrl
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

const getQrCodePath = async (req: Request, res: Response) => {
    try {
        const { alias } = req.params;
        const existingLink = await linkModel.findOne({ alias }).exec();
        if (!existingLink) return res.status(404).json({
            status: false,
            message: "Link alias not found"
        });
        return res.status(200).json({
            status: true,
            message: "Qr code gotten",
            data: existingLink.path
        })
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}




const deleteLink = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const link: any = await linkModel.findOne({ _id: id }).exec()
        if (!link) return res.status(404).json({
            status: false,
            message: "Link does not exist"
        })
        // delete the link
        await linkModel.deleteOne({ _id: id })
        return res.status(200).json({
            status: true,
            message: "Link deleted successfully"
        });
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

const getHitsConfig = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const existingLink = await linkModel.findOne({ _id: id }).exec()
        if (!existingLink) return res.status(404).json({
            status: false,
            message: "Link does not exist"
        })
        const hitsByMonth: { [key: string]: number } = {}; // Object to store hits count for each month

        existingLink.hits.forEach(hit => {
            // @ts-ignore
            const createdAt = new Date(hit.createdAt);
            const month = createdAt.toLocaleDateString('en-US', { month: 'long' }); // Get month name

            if (hitsByMonth[month]) {
                hitsByMonth[month] += 1;
            } else {
                hitsByMonth[month] = 1;
            }
        });
        const totalHitsCount = existingLink.hits.length
        return res.status(200).json({
            status: true,
            message: "Link information retrreived successfully",
            month: Object.keys(hitsByMonth)[0],
            numOfClicks: Object.values(hitsByMonth)[0],
            hits: existingLink.hits,
            totalCount: totalHitsCount
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export { createLink, generateQR, getLinks, deleteLink, createLinkForUnautheticatedUser, getHitsConfig, getQrCodePath }
