const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    // isDeleted: { type: Boolean, default: false, required: true },

    forUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    // isRead: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

// notificationSchema.pre("find", function () {
//   this.where({ isDeleted: false });
// });
// notificationSchema.pre("findOne", function () {
//   this.where({ isDeleted: false });
// });

//Create and export model

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
