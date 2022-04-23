const mongoose = require("mongoose")

var darasaSchema = new mongoose.Schema({
  level: { type: Number, unique: true },
  label: { type: String, lowercase: true, unique: true },
  students: { type: [Number] },
})
// Compile model from schema
var Darasa = mongoose.model("class", darasaSchema)

module.exports = Darasa
