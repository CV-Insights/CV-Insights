const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;
const MAX_BCRYPT_PASSWORD_BYTES = 72;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId.toString(),
    expiresIn: "7d",
  });
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isValidRegistration(name, email, password) {
  return (
    typeof name === "string" &&
    name.trim().length >= MIN_NAME_LENGTH &&
    typeof email === "string" &&
    EMAIL_PATTERN.test(email.trim()) &&
    typeof password === "string" &&
    password.length >= MIN_PASSWORD_LENGTH &&
    Buffer.byteLength(password, "utf8") <= MAX_BCRYPT_PASSWORD_BYTES
  );
}

async function register(req, res) {
  const { name, email, password } = req.body || {};

  if (!isValidRegistration(name, email, password)) {
    return res.status(400).json({
      error: "Enter a valid name and email, and a password of 8 to 72 bytes.",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizeEmail(email),
    passwordHash,
  });

  return res.status(201).json({
    token: createToken(user._id),
    user: toPublicUser(user),
  });
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      error: "Email and password are required.",
    });
  }

  const user = await User.findOne({ email: normalizeEmail(email) })
    .select("+passwordHash");

  const passwordMatches =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!passwordMatches) {
    return res.status(401).json({
      error: "Email or password is incorrect.",
    });
  }

  return res.json({
    token: createToken(user._id),
    user: toPublicUser(user),
  });
}

async function getCurrentUser(req, res) {
  const user = await User.findById(req.userId).select("name email");

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.json({ user: toPublicUser(user) });
}

module.exports = {
  register,
  login,
  getCurrentUser,
};
