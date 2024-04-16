import { Schema, model } from "mongoose"
import { User } from "../user/user.interfaces"
import bcrypt from "bcrypt"
import v from "validator"


const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (str: string) => {
                v.isEmail(str)
            },
            message: "`{VALUE}` is not a valid email address"
        },
    },
    password: {
        type: String
    },
    googleId : {
        type : String
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: "Link"
    }],
    totalHits: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
})


// Hash passwords
userSchema.pre<User>("save", async function (next: () => void) {
    const user = this
    if (!user.isModified("password")) return next(); // Skip if password is not modified
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

userSchema.methods.IsValidPassword = async function (password: string): Promise<boolean>{
    const user = this as User
    const compare = await bcrypt.compare(password, user.password)
    return compare
}


const userModel = model<User>("User", userSchema)

export default userModel