const mongoose = require("mongoose")

const cohortSchema = new mongoose.Schema({
  classs: { type: Number },
  id: { type: Number },
  term1Fees: { type: Number },
  term2Fees: { type: Number },
  term3Fees: { type: Number },
  term1Start: { type: String },
  term2Start: { type: String },
  term3Start: { type: String },
  term1End: { type: String },
  term2End: { type: String },
  term3End: { type: String },
  label: { type: String },
})

module.exports = new mongoose.model("cohort", cohortSchema)
