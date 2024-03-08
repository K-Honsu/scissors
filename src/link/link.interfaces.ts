import { Document, Schema } from "mongoose";

interface Hit {
    type: "click" | "scan";
    ip?: string;
    referrer?: string;
    country?: string;
    city?: string;
    timezone?: string;
    as?: string;
}

interface Link extends Document {
    url: string;
    description?: string;
    alias: string;
    createdBy: Schema.Types.ObjectId;
    hits: Hit[];
    createdAt: Date;
}

export default Link;
