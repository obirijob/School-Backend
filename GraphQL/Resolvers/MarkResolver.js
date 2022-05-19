const { GraphQLString, GraphQLInt, GraphQLList } = require("graphql")
const Mark = require("../../Models/Mark")
const Student = require("../../Models/Student")
const { MarkType } = require("../Types/MarkType")
const { StudentMarksType } = require("../Types/StudentMarksType")

const addMark = {
  type: MarkType,
  args: {
    student: { type: GraphQLInt },
    cohort: { type: GraphQLInt },
    subject: { type: GraphQLString },
    term1catScore: { type: GraphQLInt },
    term1examScore: { type: GraphQLInt },
    term2catScore: { type: GraphQLInt },
    term2examScore: { type: GraphQLInt },
    term3catScore: { type: GraphQLInt },
    term3examScore: { type: GraphQLInt },
  },
  async resolve(_, args) {
    let {
      student,
      cohort,
      subject,
      term1catScore,
      term1examScore,
      term2catScore,
      term2examScore,
      term3examScore,
    } = args

    let m = await Mark.findOne({ student, cohort, subject })
    if (m) throw new Error("Mark already there")

    try {
      let grade = new Mark({
        student,
        cohort,
        subject,
        term1catScore,
        term1examScore,
        term2catScore,
        term2examScore,
        term3examScore,
      })
      let g = await grade.save()
      return g
    } catch (e) {
      throw new Error(e)
    }
  },
}

const editMark = {
  type: MarkType,
  args: {
    student: { type: GraphQLInt },
    cohort: { type: GraphQLInt },
    subject: { type: GraphQLString },
    term1catScore: { type: GraphQLInt },
    term1examScore: { type: GraphQLInt },
    term2catScore: { type: GraphQLInt },
    term2examScore: { type: GraphQLInt },
    term3catScore: { type: GraphQLInt },
    term3examScore: { type: GraphQLInt },
  },
  async resolve(_, args) {
    let {
      student,
      cohort,
      subject,
      term1catScore,
      term1examScore,
      term2catScore,
      term2examScore,
      term3catScore,
      term3examScore,
    } = args

    let mar = await Mark.findOne({ student, cohort, subject })

    if (mar) {
      let m = await Mark.findOneAndUpdate(
        { student, cohort, subject },
        {
          term1catScore,
          term1examScore,
          term2catScore,
          term2examScore,
          term3catScore,
          term3examScore,
        }
      )

      return m
    } else {
      try {
        let grade = new Mark({
          student,
          cohort,
          subject,
          term1catScore,
          term1examScore,
          term2catScore,
          term2examScore,
          term3examScore,
        })
        let g = await grade.save()
        return g
      } catch (e) {
        throw new Error(e)
      }
    }
  },
}

const marks = {
  type: new GraphQLList(MarkType),
  async resolve() {
    let marks = await Mark.find()
    return marks
  },
}

const studentCohortMarks = {
  type: new GraphQLList(MarkType),
  args: { cohort: { type: GraphQLInt } },
  async resolve(_, args) {
    let { cohort } = args
    let coh = await Mark.find({ cohort })
    return coh
  },
}

const studentSubjectCohortMarks = {
  type: new GraphQLList(MarkType),
  args: {
    cohort: { type: GraphQLInt },
    student: { type: GraphQLInt },
    subject: { type: GraphQLString },
  },
  async resolve(_, args) {
    let { cohort, student, subject } = args
    let coh = await Mark.find({ cohort, student, subject })
    return coh
  },
}

const studentMarks = {
  type: StudentMarksType,
  args: { student: { type: GraphQLInt } },
  async resolve(_, a) {
    let { student } = a
    let std = await Student.findOne({ admissionNumber: student })
    return std
  },
}

module.exports = {
  addMark,
  marks,
  studentCohortMarks,
  studentMarks,
  editMark,
  studentSubjectCohortMarks,
}
