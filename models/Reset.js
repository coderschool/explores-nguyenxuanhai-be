const mongoose = require("mongoose");

const resetSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    resetToken: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
// if change, visit indexes/TTL setting in mongodb
resetSchema.index({ expireAfterSeconds: 86400 });

const Reset = mongoose.model("Reset", resetSchema);
module.exports = Reset;
