import linkModel from "../models/link";
import userModel from "../models/user";
import randomstring from "randomstring"
import client from "../utils/Cache/redis";
import QRCode from 'qrcode'
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
    try {
        const userId: string = req.user._id
        const { descriptionQ } = req.query;
        const query = { createdBy: userId };

        if (descriptionQ) {
            // @ts-ignore
            query['description'] = { $regex: descriptionQ, $options: 'i' };
        }
        const userLinks = await linkModel.find(query).lean().exec()
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

        // Return the data from the server
        res.status(200).json({
            status: true,
            message: `Links for user ${userId} from the server`,
            data: links
        });

        // Cache the data if it's not already cached
        // const cachedData: any = await client.hGetAll(userId.toString());
        // if (!cachedData) {
        //     const linksObject = {};
        //     // @ts-ignore
        //     links.forEach(link => {
        //         // @ts-ignore
        //         linksObject[link._id] = true;
        //         // @ts-ignore
        //         linksObject[link.url] = true;
        //         // @ts-ignore
        //         linksObject[`${baseUrl}/${link.alias}`] = true;
        //     });
        //     await client.hSet(userId.toString(), linksObject);
        //     console.log(`Data for user ${userId} has been cached`);
        // } else {
        //     console.log(`Data for user ${userId} retrieved from cache`);
        // }
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
        // const text = req.params.alias
        const { alias } = req.params
        const existingLink = await linkModel.findOne({ alias }).exec()
        if (!existingLink) return res.status(404).json({
            status: false,
            message: "Link alias not found"
        })
        const { url } = existingLink
        // @ts-ignore
        const qrCodeFilePath = `./${alias}.png`;
        await QRCode.toFile(qrCodeFilePath, url);

        // Send the file path to the client
        return res.status(200).json({
            status: true,
            message: "QR code generated",
            data: qrCodeFilePath
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
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
        const totalHitsCount = existingLink.hits.length
        return res.status(200).json({
            status: true,
            message: "Link information retrreived successfully",
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

export { createLink, generateQR, getLinks, deleteLink, createLinkForUnautheticatedUser, getHitsConfig }
