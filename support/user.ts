import mongoose, { Schema, Document, ObjectId } from "mongoose";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const salt: number = 12;

export interface IUser extends Document {
    id : ObjectId
    name : string;
    email : string;
    password : string;
    email_verified : boolean
}

const UserSchema : Schema<IUser> = new Schema<IUser>({
    // id:{
    //     type:  mongoose.Schema.Types.ObjectId,
    // },

    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email_verified: {
        type: Boolean
    }
})

// * Hash the password befor it is beeing saved to the database
UserSchema.pre('save', function (next: (err: Error | null) => void) {
    // * Make sure you don't hash the hash
    if (!this.isModified('password')) {
        return next(null);
    }
    bcrypt.hash(this.password, salt, (err: Error|undefined, hash: string) => {
        if (err) return next(err);
        this.password = hash;
        next(null);
    });
});

UserSchema.methods.comparePasswords = function (
    candidatePassword: string,
    next: (err: Error | null, same: Boolean | null) => void,
) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return next(err, null);
        }
        next(null, isMatch);
    });
};

export const User = mongoose.model<IUser>('User',UserSchema);
