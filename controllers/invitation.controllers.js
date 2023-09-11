const mongoose = require("mongoose");
const crypto = require("crypto");
const { promisify } = require("util");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Invitation = require("../models/Invitation");

const invitationController = {};

invitationController.createInvitation = catchAsync(async (req, res, next) => {
  const { email } = req.body;
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

  const link = `${req.protocol}://${req.get(
    "host"
  )}/users/confirm_email?email=${email}&token=${inviteToken}`;

  sendResponse(res, 200, true, { link }, null, "Invite successful");
});

invitationController.confirmEmail = catchAsync(async (req, res, next) => {
  let { email, token } = req.query;

  // check email and token in Invitation
  // ...

  sendResponse(
    res,
    200,
    true,
    { email, token },
    null,
    "Confirm Invitation Email successful"
  );
});

module.exports = invitationController;
