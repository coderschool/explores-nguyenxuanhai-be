const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    aboutTask: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Task",
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
commentSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

//Create and export model

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
