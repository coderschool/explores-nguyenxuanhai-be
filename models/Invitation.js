const mongoose = require("mongoose");

const invitationSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    inviteToken: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
invitationSchema.index({ expireAfterSeconds: 86400 });

const Invitation = mongoose.model("Invitation", invitationSchema);
module.exports = Invitation;
