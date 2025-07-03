import bcrypt from "bcryptjs";
import { Document, Schema, model } from "mongoose";

import { IUser } from "../interfaces/user.interface";

type NextFunction = (err?: any) => void;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [ true, "Name is required" ],
      unique: [ true, "User already exist" ],
      max: [ 20, "Name should not be longer than 20 characters" ],
      min: [ 1, "Name should not be shorter than 1 character" ],
    },
    email: {
      type: String,
      required: [ true, "Email is required" ],
      unique: [ true, "Email already exist" ],
      max: [ 50, "Email should not be longer than 50 characters" ],
      min: [ 5, "Email should not be shorter than 5 characters" ],
      match: [ /^\S+@\S+\.\S+$/, "Please fill a valid email address" ],
    },
    password: {
      type: String,
      required: [ true, "Password is required" ],
      min: [ 6, "Password should be at least 6 characters" ],
      max: [ 128, "Password should not be longer than 128 characters" ],
    }
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.methods.comparePassword = async function ( plainPassword: string )
{
    return bcrypt.compare( plainPassword, this.password );
};

userSchema.virtual("activeSessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "user",
});

userSchema.pre("validate", function (next) {
  this.email = this.email.toLowerCase();
  next();
});

userSchema.pre( "save", async function ( this: Document & IUser, next: NextFunction )
{
  if ( !this.isModified( "password" ) ) return next();
  this.password = await bcrypt.hash( this.password, 10 );
  next();
} );

userSchema.pre( "findOneAndDelete", async function ( next )
{
  const docToDelete = await this.model.findOne( this.getFilter() );
  if ( docToDelete )
  {
    const Session = require( "./session.model" );
    await Session.deleteMany( { user: docToDelete._id } );
  }
  next();
} );

export const User = model<IUser>("User", userSchema);