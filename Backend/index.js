import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "./Mogodb.js";

dotenv.config();

const app = express();
const PORT= process.env.PORT||3000

app.use(cors());
app.use(express.json());

let db;

const JWT_SECRET = process.env.JWT_SECRET;

// =======================
// JWT Middleware
// =======================
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token not provided",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid Token",
      });
    }

    req.user = decoded;
    next();
  });
}

// =======================
// Get All Users
// =======================
app.get("/", async (req, res) => {
  try {
    const users = await db.collection("UserDetail").find({}).toArray();

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

// =======================
// Register
// =======================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, contactNum, gender } = req.body;

    const usersCollection = db.collection("UserDetail");

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      contactNum,
      gender,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// =======================
// Login
// =======================
app.post("/login", async (req, res) => {
  console.log("req.body",req.body)
  try {
    const { email, password } = req.body;

    const usersCollection = db.collection("UserDetail");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // Compare Password
    // const isMatch = await bcrypt.compare(
    //   password,
    //   user.password
    // );

    // if (!isMatch) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid Password",
    //   });
    // }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNum: user.contactNum,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// =======================
// Protected Route
// =======================
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await db.collection("UserDetail").findOne(
      {
        email: req.user.email,
      },
      {
        projection: {
          password: 0,
        },
      }
    );

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
});

// =======================
// Reset Password
// =======================
app.put("/password-reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    const result = await db.collection("UserDetail").updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
});

// =======================
// Start Server
// =======================
async function startServer() {
  try {
    db = await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on port ${process.env.PORT}`
      );
    });
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
  }
}

startServer();