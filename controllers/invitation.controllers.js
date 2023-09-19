const mongoose = require("mongoose");
const crypto = require("crypto");
const { promisify } = require("util");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Invitation = require("../models/Invitation");
const User = require("../models/User");

const invitationController = {};

invitationController.createInvitation = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  // const inviteToken = crypto.randomBytes(48).toString("base64url");
  const randomBytesAsync = promisify(crypto.randomBytes);
  const inviteToken = (await randomBytesAsync(48)).toString("base64url");

  let invitation = await Invitation.findOne({ email });
  if (invitation)
    throw new AppError(
      400,
      "Invitation already exists",
      "Create Invitation Error"
    );

  invitation = await Invitation.create({ email, inviteToken });

  // create new unverified user/employee
  await User.create({ name, email, password: `${email}123abc` });

  const link = `${req.protocol}://${req.get(
    "host"
  )}/api/invitations/confirm_email?email=${email}&token=${inviteToken}`;

  sendResponse(res, 200, true, { link, invitation }, null, "Invite successful");
});

invitationController.confirmEmail = catchAsync(async (req, res, next) => {
  let { email, token } = req.query;

  // check email and token in Invitation
  let invitation = await Invitation.findOne({ inviteToken: token });
  if (!invitation)
    throw new AppError(400, "Invitation not found", "Confirm Email Error");

  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  );

  const tempPass = `${email}123abc`;

  await Invitation.findOneAndDelete({ inviteToken: token });

  sendResponse(
    res,
    200,
    true,
    { user, tempPass },
    null,
    "Confirm Invitation Email successful"
  );
});

module.exports = invitationController;