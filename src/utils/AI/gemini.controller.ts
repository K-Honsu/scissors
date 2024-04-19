import { Request, Response } from "express";
import model from "./gemini";

const generateResponse = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return res.status(200).json({
            status: true,
            message: "Message generated successfully",
            data: text
        })
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Internal server error", data: err.message });
    }
};

export default generateResponse