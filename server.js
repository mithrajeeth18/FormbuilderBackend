require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const formSchema = new mongoose.Schema({ config: Array }, { timestamps: true });
const Form = mongoose.model("Form", formSchema);

// POST /forms - Store form config
app.post("/forms", async (req, res) => {
  try {
    const newForm = new Form({ config: req.body });
    const saved = await newForm.save();
    res.json({ id: saved._id });
    console.log("done posting")
  } catch (err) {
    res.status(500).json({ error: "Failed to save form" });
  }
});

// GET /forms/:id - Retrieve form config
app.get("/forms/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Not found" });
    res.json({ form: form.config });
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is awake 🚀");
});
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
