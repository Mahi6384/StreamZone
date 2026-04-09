const User = require("../models/userModel");
const { OAuth2Client } = require("google-auth-library");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Securely compare hashed password using the method on the model
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GOOGLE LOGIN (ID token verification)
const googleLogin = async (req, res) => {
  try {
    const { idToken, credential } = req.body || {};
    const token = idToken || credential;

    if (!token) {
      return res.status(400).json({ message: "Missing Google credential" });
    }
    if (!googleClient) {
      return res.status(500).json({ message: "Google OAuth is not configured" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split("@")[0];
    const googleId = payload.sub;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        provider: "google",
        googleId,
        name,
        email,
      });
    } else {
      // If an existing local user signs in with Google, link provider details.
      if (!user.googleId) user.googleId = googleId;
      if (!user.provider) user.provider = "local";
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err.message);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

module.exports = { signup, login, googleLogin };
