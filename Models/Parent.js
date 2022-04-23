const mongoose = require("mongoose")

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  male: { type: Boolean, default: true },
  students: { type: [Number] },
  password: { type: String },
  addebBy: { type: String },
})

module.exports = new mongoose.model("parent", parentSchema)
