const { GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const GradeLetter = require("../../Models/GradeLetter")
const GradeLetterType = require("../Types/GradeLetterType")

const addGradeLetter = {
  type: GradeLetterType,
  args: {
    low: { type: GraphQLInt },
    high: { type: GraphQLInt },
    letter: { type: GraphQLString },
  },
  async resolve(_, args, req) {
    // comment out the below line (throw new Error...) if not grades added!
    throw new Error(
      "All grades added. Please contact developer for more details"
    )
    const { low, high, letter } = args
    const gl = new GradeLetter({
      high,
      low,
      letter,
    })
    try {
      let grl = await gl.save()
      return grl
    } catch (e) {
      throw new Error(e)
    }
  },
}

const gradeLetters = {
  type: new GraphQLList(GradeLetterType),
  async resolve(_, args, req) {
    let gl = await GradeLetter.find().sort({ high: -1 })
    return gl
  },
}

const getGrade = {
  type: GradeLetterType,
  args: { marks: { type: GraphQLInt } },
  async resolve(_, args) {
    const { marks } = args
    let gl = await GradeLetter.findOne().and([
      { low: { $lt: marks } },
      { high: { $gte: marks } },
    ])
    if (!gl) {
      return {
        high: 0,
        low: 0,
        letter: "i",
      }
    }
    return gl
  },
}

module.exports = { addGradeLetter, gradeLetters, getGrade }
