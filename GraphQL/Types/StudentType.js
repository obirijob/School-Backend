const Student = require("../../Models/Student")
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql")
const Parent = require("../../Models/Parent")
const Darasa = require("../../Models/Darasa")
const { SubjectType } = require("./SubjectType")
const Subject = require("../../Models/Subject")
const { CohortType } = require("./CohortType")
const Cohort = require("../../Models/Cohort")
const mongoose = require("mongoose")
const { ClassType } = require("./ClassType")
// const { StudentMarksType } = require("./StudentMarksType")
// const { DarasaType } = require("./DarasaType")

const StudentType = new GraphQLObjectType({
  name: "studenttype",
  fields: () => ({
    name: { type: GraphQLString },
    admissionNumber: { type: GraphQLInt },
    _id: { type: GraphQLString },
    photo: { type: GraphQLString },
    parent: {
      type: ParentType,
      async resolve(_) {
        let pr = await Parent.findOne({ students: { $in: _.admissionNumber } })
        return pr
      },
    },
    subjects: {
      type: new GraphQLList(SubjectType),
      async resolve(_) {
        let { subjects } = _
        //console.log(_)
        let sub = await Subject.find({ code: { $in: subjects } })
        return sub
      },
    },
    cohorts: {
      type: new GraphQLList(CohortType),
      async resolve(_) {
        let { cohorts } = _
        let c = []
        for (let cc of cohorts) {
          let coh = await Cohort.findOne({ id: cc })
          c.push(coh)
        }
        return c
      },
    },
    class: {
      type: ClassType,
      async resolve(_) {
        let { admissionNumber } = _
        let cls = await Darasa.findOne({ students: { $in: admissionNumber } })
        return cls
      },
    },
  }),
})

const ParentType = new GraphQLObjectType({
  name: "parenttype",
  fields: () => ({
    name: { type: GraphQLString },
    phone: { type: GraphQLInt },
    email: { type: GraphQLString },
    male: { type: GraphQLBoolean },
    addedBy: { type: GraphQLString },
    students: {
      type: GraphQLList(StudentType),
      async resolve(_) {
        const { students } = _
        let stds = []
        for (let s of students) {
          let std = await Student.findOne({ admissionNumber: s })
          stds.push(std)
        }
        return stds
      },
    },
  }),
})

const AuthParentType = new GraphQLObjectType({
  name: "authparenttype",
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    authToken: { type: GraphQLString },
  }),
})

module.exports = { ParentType, StudentType, AuthParentType }
