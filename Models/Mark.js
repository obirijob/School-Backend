const mongoose = require("mongoose")

const markSchema = new mongoose.Schema({
  student: { type: Number, required: true },
  cohort: { type: Number, required: true },
  subject: { type: String, required: true },
  term1catScore: { type: Number, required: true, default: 0 },
  term1examScore: { type: Number, required: true, default: 0 },
  term2catScore: { type: Number, required: true, default: 0 },
  term2examScore: { type: Number, required: true, default: 0 },
  term3catScore: { type: Number, required: true, default: 0 },
  term3examScore: { type: Number, required: true, default: 0 },
})

module.exports = new mongoose.model("mark", markSchema)
