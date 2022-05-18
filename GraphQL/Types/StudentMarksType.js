const { GraphQLObjectType, GraphQLList } = require("graphql")
const Cohort = require("../../Models/Cohort")
const Mark = require("../../Models/Mark")
const Student = require("../../Models/Student")
const Subject = require("../../Models/Subject")
const { CohortType } = require("./CohortType")
const { MarkType } = require("./MarkType")
const { StudentType } = require("./StudentType")

const StudentCohortMarksType = new GraphQLObjectType({
  name: "cohmarks",
  fields: () => ({
    cohort: {
      type: CohortType,
      async resolve(_) {
        let { cohort } = _
        let c = await Cohort.findOne({ id: cohort })
        return c
      },
    },
    marks: {
      type: new GraphQLList(MarkType),
      async resolve(_) {
        let { cohort, student } = _
        let subs = await Subject.find({ compulsory: true })
        let sub = student.subjects
        for (let s of subs) {
          if (!sub.includes(s.code)) sub.unshift(s.code)
        }
        let cohss = []
        for (let cohs of sub) {
          let coh = await Mark.findOne({
            cohort,
            student: student.admissionNumber,
            subject: cohs,
          })
          if (coh) {
            cohss.push(coh)
          } else {
            cohss.push({
              student: student.admissionNumber,
              cohort,
              subject: cohs,
              term1catScore: 0,
              term1examScore: 0,
              term2catScore: 0,
              term2examScore: 0,
              term3catScore: 0,
              term3examScore: 0,
            })
          }
        }
        return cohss
      },
    },
  }),
})

const StudentMarksType = new GraphQLObjectType({
  name: "smtype",
  fields: () => ({
    student: {
      type: StudentType,
      async resolve(_) {
        let { admissionNumber } = _
        let std = await Student.findOne({ admissionNumber })
        return std
      },
    },
    cohortMarks: {
      type: new GraphQLList(StudentCohortMarksType),
      async resolve(_) {
        let { admissionNumber } = _
        let std = await Student.findOne({ admissionNumber })
        let cohorts = []
        for (let c of std.cohorts) {
          let coh = {
            student: std,
            cohort: c,
          }
          cohorts.push(coh)
        }
        return cohorts
      },
    },
  }),
})

module.exports = { StudentMarksType, StudentCohortMarksType }
