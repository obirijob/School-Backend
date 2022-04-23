const mongoose = require("mongoose")

const logSchema = new mongoose.Schema({
  email: { type: String, required: true },
  actionType: { type: String, enum: ["login", "student"] },
  action: { type: String },
})

module.exports = new mongoose.model("log", logSchema)
