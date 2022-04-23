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
// const { DarasaType } = require("./DarasaType")

const StudentType = new GraphQLObjectType({
  name: "studenttype",
  fields: () => ({
    name: { type: GraphQLString },
    admissionNumber: { type: GraphQLInt },
    photo: { type: GraphQLString },
    parent: {
      type: ParentType,
      async resolve(_) {
        let pr = await Parent.findOne({ students: { $in: _.admissionNumber } })
        return pr
      },
    },
    // darasa: {
    //   type: DarasaType,
    //   async resolve(_) {
    //     let { admissionNumber } = _
    //     let cls = await Darasa.findOne({ students: { $in: admissionNumber } })
    //     return cls
    //   },
    // },
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
