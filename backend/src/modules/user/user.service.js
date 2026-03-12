const { models } = require("../../models");
const { User } = models;

exports.createUser = async ({ full_name, email, password, role }) => {
  return User.create({ full_name, email, password, role });
};

exports.getAllUsers = async () => {
  return User.findAll();
};

exports.getUserById = async (id) => {
  return User.findByPk(id);
};

exports.updateUser = async (id, { full_name, email, password, role }) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.full_name = full_name || user.full_name;
  user.email = email || user.email;
  user.password = password || user.password;
  user.role = role || user.role;
  await user.save();
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
};
