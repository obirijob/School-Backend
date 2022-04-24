const mongoose = require("mongoose")

const subSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  label: { type: String, unique: true },
  compulsory: { type: Boolean },
  category: {
    type: String,
    enum: ["languages", "sciences", "arts", "technical"],
  },
})

module.exports = new mongoose.model("subject", subSchema)
