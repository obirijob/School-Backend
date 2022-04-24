const mongoose = require("mongoose")

const gradeSchema = new mongoose.Schema({
  low: { type: Number },
  high: { type: Number },
  letter: { type: String, unique: true },
})

module.exports = new mongoose.model("gradeLetter", gradeSchema)
