const { models } = require("../models");
const { User } = models;

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;
    const newUser = await User.create({ full_name, email, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (user) {
      user.full_name = full_name || user.full_name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
