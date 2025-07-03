import { Schema, model } from "mongoose";
import { ISession } from "../interfaces/session.interface";

const sessionSchema = new Schema<ISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// TTL index
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

sessionSchema.post("save", function (doc) {
  console.log(`New session created for user ${doc.user} at ${doc.createdAt}`);
});

sessionSchema.pre("save", async function (next) {
  if (this.isModified("refreshToken")) {
    console.log("Rotating refresh token for session", this._id);
  }

  // Prevent duplicate active sessions (single device policy)
  const existing = await ( this.constructor as typeof Session ).findOne( { user: this.user } );
  
  if (existing) {
    await existing.deleteOne();
  }

  next();
} );

// sessionSchema.pre( "save", async function ( next )
// {
//     const sessions = await this.constructor.find( { user: this.user } );
//     if ( sessions.length >= 3 )
//     {
//         // Remove oldest
//         const oldest = sessions.sort( ( a, b ) => a.createdAt - b.createdAt )[ 0 ];
//         await oldest.deleteOne();
//     }
//     next();
// } );  

export const Session = model<ISession>("Session", sessionSchema);