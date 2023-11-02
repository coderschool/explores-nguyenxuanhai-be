const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    forUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

//Create and export model

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
