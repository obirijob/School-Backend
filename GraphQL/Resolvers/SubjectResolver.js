const {
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
} = require("graphql")
const Student = require("../../Models/Student")
const Subject = require("../../Models/Subject")
const { SubjectType } = require("../Types/SubjectType")

const subjects = {
  type: new GraphQLList(SubjectType),
  async resolve(_, a, req) {
    // if (!req.user.loggedIn) throw new Error("You are not Logged In")
    let subs = await Subject.find()
    return subs
  },
}

const compulsorySubjects = {
  type: new GraphQLList(SubjectType),
  async resolve(_, a, req) {
    // if (!req.user.loggedIn) throw new Error("You are not Logged In")
    let subs = await Subject.find({ compulsory: true })
    return subs
  },
}

const addSubject = {
  type: SubjectType,
  args: {
    label: { type: GraphQLString },
    category: { type: GraphQLString },
    compulsory: { type: GraphQLBoolean },
  },
  async resolve(_, args, req) {
    if (!req.user.loggedIn) throw new Error("You are not Logged In")
    if (!req.user.details.roles.includes("principal"))
      throw new Error("You are not allowed to add a subject")
    const { label, compulsory, category } = args
    const sub = await Subject.find()
    const code = `${category.substring(0, 1)}${
      sub.filter(s => s.category == category).length + 1
    }`
    const subject = new Subject({
      code,
      label,
      compulsory,
      category,
    })
    try {
      let subj = await subject.save()
      return subj
    } catch (e) {
      throw new Error(e)
    }
  },
}

const studentAddSubject = {
  type: SubjectType,
  args: {
    admissionNumber: { type: GraphQLInt },
    subject: { type: GraphQLString },
  },
  async resolve(_, args, req) {
    if (!req.user.loggedIn) throw new Error("You are not Logged In")
    if (!req.user.details.roles.includes("admit"))
      throw new Error("You are not allowed to add a subject to a student")
    let { admissionNumber, subject } = args
    let comp = await Subject.findOne({ code: subject })
    if (!comp) throw new Error("Subject not found!")
    if (comp && comp.compulsory)
      throw new Error("This subject is mandatory for all students")
    let stdSub = await Student.findOne({ admissionNumber })
    if (!stdSub) throw new Error("Student Not Found")
    let mySub = stdSub.subjects
    if (!mySub.includes(subject)) {
      let sstd = await Student.findOneAndUpdate(
        { admissionNumber },
        { subjects: [...mySub, subject] }
      )
      return comp
    } else {
      throw new Error("You already have that subject")
    }
  },
}
const studentRemoveSubject = {
  type: SubjectType,
  args: {
    admissionNumber: { type: GraphQLInt },
    subject: { type: GraphQLString },
  },
  async resolve(_, args, req) {
    if (!req.user.loggedIn) throw new Error("You are not Logged In")
    if (!req.user.details.roles.includes("admit"))
      throw new Error("You are not allowed to remove a subject from a student")
    let { admissionNumber, subject } = args
    let comp = await Subject.findOne({ code: subject })
    if (!comp) throw new Error("Subject not found!")
    if (comp && comp.compulsory)
      throw new Error("This subject is mandatory for all students")
    let stdSub = await Student.findOne({ admissionNumber })
    if (!stdSub) throw new Error("Student Not Found")
    let mySub = stdSub.subjects
    if (mySub.includes(subject)) {
      let st = [...mySub.filter(s => s !== subject)]
      let sstd = await Student.findOneAndUpdate(
        { admissionNumber },
        { subjects: st }
      )
      return comp
    } else {
      throw new Error("You are not taking this subject")
    }
  },
}

module.exports = {
  addSubject,
  subjects,
  compulsorySubjects,
  studentAddSubject,
  studentRemoveSubject,
}
