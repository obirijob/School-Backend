const { GraphQLString, GraphQLList, GraphQLInt } = require("graphql")
const Parent = require("../../Models/Parent")
const Student = require("../../Models/Student")
const { StudentType } = require("../Types/StudentType")

const addStudent = {
  type: StudentType,
  args: {
    name: { type: GraphQLString },
    parent: { type: GraphQLString },
  },
  async resolve(_, args, req) {
    if (!req.user.loggedIn) throw new Error("You are not Logged In")
    if (!req.user.details.roles.includes("admit"))
      throw new Error("You are not allowed to add a student")

    let { name, parent } = args
    let parr = await Parent.findOne({ email: parent })
    //console.log(parr, parent)
    if (!parr) throw new Error("Parent not found!")
    let stdss = parr.students
    let ast = await Student.find({})
    let admissionNumber = ast.length + 1
    let std = new Student({
      name,
      admissionNumber,
    })
    let sss = await std.save()
    await Parent.findOneAndUpdate(
      { email: parent },
      { students: [...stdss, admissionNumber] }
    )
    return sss
  },
}

const students = {
  type: new GraphQLList(StudentType),
  async resolve() {
    let stds = await Student.find()
    return stds
  },
}

const singleStudent = {
  type: StudentType,
  args: { admissionNumber: { type: GraphQLInt } },
  async resolve(_, args) {
    let { admissionNumber } = args
    let stds = await Student.findOne({ admissionNumber })
    return stds
  },
}

module.exports = { addStudent, students, singleStudent }
