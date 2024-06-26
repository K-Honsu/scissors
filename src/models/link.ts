import { Schema, model } from "mongoose"
import v from "validator"

const hitSchema = new Schema({
    type: {
        type: String,
        enum: ["click", "scan"],
        required: true
    },
    // From browser
    ip: String,
    referrer: String,

    // External IP API
    country: String,
    city: String,
    timezone: String,
    as: String  // ISP
}, {
    timestamps: { createdAt: true, updatedAt: false }
})

const linkSchema = new Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: (str: string) => {
                return v.isURL(str)
            },
            message: "`{VALUE}` is not a valid URL"
        }
    },
    description: String,  // Optional description of link
    cloudinaryId: { type: String },
    path: { type: String },
    alias: {
        type: String,
        required: true,
        unique: true,  // Create a unique index
        immutable: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    hits: [hitSchema]  // Store information on all hits

}, { timestamps: true })


const linkModel = model("Link", linkSchema)

export default linkModel