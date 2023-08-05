const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, gender, address, phone, birthDate } = req.body;
  const user = req.user;

  // update the user data
  if (name) user.name = name;
  if (gender) user.gender = gender;
  if (address) user.address = address;
  if (phone) user.phone = phone;
  if (birthDate) user.birthDate = new Date(birthDate);

  // save the updated user data
  const updatedUser = await user.save({ validateModifiedOnly: true });
  if (!updatedUser)
    return next(
      new AppError('Error updating your data, please try again.', 400)
    );

  // send res with success status
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedUser,
    },
  });
});
