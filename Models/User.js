const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 4 },
  roles: { type: [String], default: [] },
  photo: { type: String, default: "/images/noimage" },
})

module.exports = new mongoose.model("user", userSchema)
