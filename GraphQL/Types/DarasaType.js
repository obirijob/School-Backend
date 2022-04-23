const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require("graphql")
const Student = require("../../Models/Student")
const { StudentType } = require("./StudentType")

const DarasaType = new GraphQLObjectType({
  name: "darasa",
  fields: () => ({
    level: { type: GraphQLInt },
    label: { type: GraphQLString },
    students: {
      type: new GraphQLList(StudentType),
      async resolve(_) {
        let { students } = _
        let std = []
        for (let s of students) {
          let ss = await Student.findOne({ admissionNumber: s })
          std.push(ss)
        }
        return std
      },
    },
  }),
})

module.exports = { DarasaType }
