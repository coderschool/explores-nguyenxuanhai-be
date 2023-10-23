const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    message: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    // forUsers: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    forCreator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    forAssignee: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

notificationSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
notificationSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

//Create and export model

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
