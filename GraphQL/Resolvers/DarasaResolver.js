const { GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const Darasa = require("../../Models/Darasa")
const { DarasaType } = require("../Types/DarasaType")

const addClass = {
  type: DarasaType,
  args: { level: { type: GraphQLInt }, label: { type: GraphQLString } },
  async resolve(_, args, req) {
    if (!req.user.loggedIn) throw new Error("You are not Logged In")
    if (!req.user.details.roles.includes("principal"))
      throw new Error("You are not allowed to add a class")
    let { label, level } = args
    let cls = new Darasa({
      level,
      label,
    })
    try {
      let c = await cls.save()
      return c
    } catch (e) {
      throw new Error(e)
    }
  },
}

const classes = {
  type: new GraphQLList(DarasaType),
  async resolve(_, args, req) {
    // if (!req.user.loggedIn) throw new Error("You are not Logged In")
    let cls = await Darasa.find()
    return cls
  },
}

const singleClass = {
  type: DarasaType,
  args: { level: { type: GraphQLInt } },
  async resolve(_, args, req) {
    let { level } = args
    // if (!req.user.loggedIn) throw new Error("You are not Logged In")
    let cls = await Darasa.findOne({ level })
    return cls
  },
}

const assignStudentToClass = {
  type: DarasaType,
  args: {
    admissionNumber: { type: GraphQLInt },
    level: { type: GraphQLInt },
  },
  async resolve(_, args, req) {
    // throw new Error("Student only assigned to cohort")
    if (!req.user.loggedIn) throw new Error("You are not Logged In")
    if (!req.user.details.roles.includes("admit"))
      throw new Error("You are not allowed to assign a student any class")
    let { admissionNumber, level } = args
    let cls = await Darasa.find({})
    let m_classes = cls.filter(c => c.students.includes(admissionNumber))
    let f = cls.filter(c => c.level === level)
    if (f.length > 0) {
      for (let m of m_classes) {
        let cc = await Darasa.findOneAndUpdate(
          { level: m.level },
          { students: m.students.filter(m => m !== admissionNumber) }
        )
      }
      let lvl = await Darasa.findOne({ level })
      let lstd = [...lvl.students]
      lstd.push(admissionNumber)
      let dr = await Darasa.findOneAndUpdate({ level }, { students: lstd })
      let drr = await Darasa.findOne({ level })
      return drr
    } else {
      throw new Error(`No class of level ${level}`)
    }
  },
}

const myClass = {
  type: DarasaType,
  args: { admissionNumber: { type: GraphQLInt } },
  async resolve(_, args) {
    const { admissionNumber } = args
    let cls = await Darasa.find()
    let mC = cls.filter(c => c.students.includes(admissionNumber))
    if (mC.length > 0) return mC[0]
    else throw new Error("You are not in any class")
  },
}

module.exports = {
  addClass,
  classes,
  assignStudentToClass,
  myClass,
  singleClass,
}
