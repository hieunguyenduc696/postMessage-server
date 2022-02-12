import brcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import user from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await brcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) res.status(400).json({ message: "User already exists." });

    if (password !== confirmPassword)
      res.status(400).json({ message: "Passwords don't match." });

    const hashPassword = await brcrypt.hash(password, 12);

    const result = await user.create({
      email,
      password: hashPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
