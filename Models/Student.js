const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admissionNumber: { type: Number, required: true },
  photo: { type: String, default: "/images/nostudent" },
})

module.exports = new mongoose.model("student", studentSchema)
