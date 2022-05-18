const { GraphQLString, GraphQLInt, GraphQLObjectType } = require("graphql")
const { CohortType } = require("../Types/CohortType")
const { StudentType } = require("../Types/StudentType")
const { SubjectType } = require("./SubjectType")
const GradeLetter = require("../../Models/GradeLetter")
const Student = require("../../Models/Student")
const Subject = require("../../Models/Subject")

const MarkType = new GraphQLObjectType({
  name: "marktype",
  fields: () => ({
    _id: { type: GraphQLString },
    cohort: { type: CohortType },
    student: {
      type: StudentType,
      async resolve(_) {
        let { student } = _
        let std = await Student.findOne({ reg_no: student })
        return std
      },
    },
    subject: {
      type: SubjectType,
      async resolve(_) {
        let { subject } = _
        let sub = await Subject.findOne({ code: subject })
        return sub
      },
    },
    term1catScore: { type: GraphQLInt },
    term2catScore: { type: GraphQLInt },
    term3catScore: { type: GraphQLInt },
    term1examScore: { type: GraphQLInt },
    term2examScore: { type: GraphQLInt },
    term3examScore: { type: GraphQLInt },
    term1Grade: {
      type: GraphQLString,
      async resolve(_) {
        let { term1catScore, term1examScore } = _
        let score = term1catScore + term1examScore
        let gradeLetter = await GradeLetter.findOne({
          low: { $lt: score },
          high: { $gte: score },
        })
        if (!gradeLetter) return "I"
        else return gradeLetter.letter.toUpperCase()
      },
    },
    term2Grade: {
      type: GraphQLString,
      async resolve(_) {
        let { term2catScore, term2examScore } = _
        let score = term2catScore + term2examScore
        let gradeLetter = await GradeLetter.findOne({
          low: { $lt: score },
          high: { $gte: score },
        })
        if (!gradeLetter) return "I"
        else return gradeLetter.letter.toUpperCase()
      },
    },
    term3Grade: {
      type: GraphQLString,
      async resolve(_) {
        let { term3catScore, term3examScore } = _
        let score = term3catScore + term3examScore
        let gradeLetter = await GradeLetter.findOne({
          low: { $lt: score },
          high: { $gte: score },
        })
        if (!gradeLetter) return "I"
        else return gradeLetter.letter.toUpperCase()
      },
    },
  }),
})

module.exports = { MarkType }
