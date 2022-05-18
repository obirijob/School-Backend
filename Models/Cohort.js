const mongoose = require("mongoose")

const cohortSchema = new mongoose.Schema({
  classs: { type: Number },
  id: { type: Number },
  term1Fees: { type: Number },
  term2Fees: { type: Number },
  term3Fees: { type: Number },
  term1Start: { type: Date },
  term2Start: { type: Date },
  term3Start: { type: Date },
  term1End: { type: Date },
  term2End: { type: Date },
  term3End: { type: Date },
  label: { type: String },
})

module.exports = new mongoose.model("cohort", cohortSchema)
