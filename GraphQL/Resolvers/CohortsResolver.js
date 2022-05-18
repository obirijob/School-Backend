const { GraphQLString, GraphQLInt, GraphQLList } = require("graphql")
const Cohort = require("../../Models/Cohort")
const Darasa = require("../../Models/Darasa")
const Student = require("../../Models/Student")
const { CohortType } = require("../Types/CohortType")
const { StudentType } = require("../Types/StudentType")

const addCohort = {
  type: CohortType,
  args: {
    classLevel: { type: GraphQLInt },
    term1Fees: { type: GraphQLInt },
    term2Fees: { type: GraphQLInt },
    term3Fees: { type: GraphQLInt },
    term1Start: { type: GraphQLString },
    term2Start: { type: GraphQLString },
    term3Start: { type: GraphQLString },
    term1End: { type: GraphQLString },
    term2End: { type: GraphQLString },
    term3End: { type: GraphQLString },
    label: { type: GraphQLString },
  },
  async resolve(_, args, req) {
    const {
      classLevel,
      label,
      term1Fees,
      term2Fees,
      term3Fees,
      term1Start,
      term2Start,
      term3Start,
      term1End,
      term2End,
      term3End,
    } = args

    const dr = await Darasa.findOne({ level: classLevel })
    if (!dr) throw new Error("Class not found!")
    let ch = await Cohort.find()
    let id = ch.length + 1
    const cls = new Cohort({
      classs: classLevel,
      label,
      id,
      term1Fees,
      term2Fees,
      term3Fees,
      term1Start,
      term2Start,
      term3Start,
      term1End,
      term2End,
      term3End,
    })

    try {
      let c = await cls.save()
      return c
    } catch (e) {
      throw new Error(e)
    }
  },
}

const cohorts = {
  type: new GraphQLList(CohortType),
  async resolve() {
    let co = await Cohort.find({})
    return co
  },
}

const singleCohort = {
  type: CohortType,
  args: { id: { type: GraphQLInt } },
  async resolve(_, args) {
    let { id } = args
    let co = await Cohort.findOne({ id })
    return co
  },
}

const registerStudentInCohort = {
  type: StudentType,
  args: { cohort: { type: GraphQLInt }, student: { type: GraphQLInt } },
  async resolve(_, args, req) {
    let { cohort, student } = args
    let co = await Cohort.findOne({ id: cohort })
    if (!co) throw new Error("Cohort not found!")
    let std = await Student.findOne({ admissionNumber: student })
    if (!std) throw new Error("Student not found!")
    let dr = await Darasa.findOne({ students: { $in: student } })
    if (!dr) {
      throw new Error(
        "Student not registered in any class. Register first before cohorting"
      )
    }
    if (dr.level !== co.classs) {
      throw new Error(
        `You are registering ${std.name.toUpperCase()} in a cohort of level ${cohort} yet he/she is in level ${
          dr.level
        }`
      )
    }
    let { cohorts } = std
    if (!cohorts) cohorts = []
    if (cohorts.includes(cohort))
      throw new Error("Student already registered in the cohort")
    let c = [...cohorts, cohort]
    let std1 = await Student.findOneAndUpdate(
      { admissionNumber: student },
      { cohorts: c }
    )
    let stdd = await Student.findOne({ admissionNumber: student })
    return stdd
  },
}

const removeStudentFromCohort = {
  type: StudentType,
  args: { cohort: { type: GraphQLInt }, student: { type: GraphQLInt } },
  async resolve(_, args) {
    const { cohort, student } = args
    let std = await Student.findOne({ admissionNumber: student })
    if (!std) throw new Error("Student Not Found")
    let cohh = std.cohorts
    let ncoh = cohh.filter(c => c !== cohort)
    let s = await Student.findOneAndUpdate(
      { admissionNumber: student },
      { cohorts: ncoh }
    )
    return s
  },
}

module.exports = {
  addCohort,
  cohorts,
  registerStudentInCohort,
  removeStudentFromCohort,
  singleCohort,
}
