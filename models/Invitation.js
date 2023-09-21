const mongoose = require("mongoose");

const invitationSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    inviteToken: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
// if change, visit indexes/TTL setting in mongodb
invitationSchema.index({ expireAfterSeconds: 86400 });

const Invitation = mongoose.model("Invitation", invitationSchema);
module.exports = Invitation;
