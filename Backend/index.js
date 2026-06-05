// import express from 'express';
// import cors from 'cors';
// import { MongoClient } from 'mongodb';
// import { connectDB } from './Mogodb.js';


// const app = express();
// app.use(cors());
// app.use(express.json());


// app.get('/', (req, res) => {
//     let usersCollection;
//     try {
//         usersCollection = connectDB();
//     } catch (err) {
//         console.error("Failed to connect MongoDB:", err);
//         return res.status(500).send("Database connection error");
//     }

//     res.send(usersCollection);
// });


// async function startServer() {
//   try {
//     await connectDB();

//     app.listen(3000, () => {
//       console.log("Server running on port 3000");
//     });
//   } catch (err) {
//     console.error("Failed to connect MongoDB:", err);
//   }
// }

// startServer();

import express from 'express';
import cors from 'cors';
import { connectDB } from './Mogodb.js';

const app = express();
app.use(cors());
app.use(express.json());
let db;

app.get('/', async (req, res) => {
  try {
    // const db = await connectDB();
    const usersCollection = db.collection('UserDetail');
    const users = await usersCollection.find({}).toArray();

    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).send("Database connection or query error");
  }
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password,contactNum,gender } = req.body; 
    const usersCollection = db.collection('UserDetail');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }  
    const newUser = { name, email, password,contactNum,gender };
    await usersCollection.insertOne(newUser);
    res.status(201).json({ success:true,
        message: "User registered successfully" 
    });
  } catch (err) {
    console.error("Failed to register user:", err);
    res.status(500).send("Database connection or query error");
  }
});
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersCollection = db.collection('UserDetail');
    const user = await usersCollection.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }   
    res.json({ success:true,
        message: "Login successful",
        user: { name: user.name, email: user.email,contactNum:user.contactNum        
    } });
  }
    catch (err) {   
    console.error("Failed to login user:", err);
    res.status(500).send("Database connection or query error");
    }
});


app.put('/password-reset', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const usersCollection = db.collection('UserDetail');
    const result = await usersCollection.updateOne(
      { email },
      { $set: { password: newPassword } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }else {
        res.json({ success:true,
            message: "Password reset successful" 
        });
    }
    } catch (err) {
    console.error("Failed to reset password:", err);
    res.status(500).send("Database connection or query error");
  } 
});

async function startServer() {
  try {
        db = await connectDB();

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Failed to connect MongoDB:", err);
  }
}

startServer();
