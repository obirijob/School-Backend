const {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} = require("graphql")
const { ParentType, AuthParentType } = require("../Types/StudentType")
const moment = require("moment")
const Parent = require("../../Models/Parent")
const jwt = require("jsonwebtoken")
const Logger = require("../../Helpers/Logger")
const LogType = require("../Types/LogType")
const Log = require("../../Models/Log")

const addParent = {
  type: ParentType,
  args: {
    name: { type: GraphQLString },
    phone: { type: GraphQLInt },
    email: { type: GraphQLString },
    male: { type: GraphQLBoolean },
  },
  async resolve(_, args, req) {
    if (!req.user.loggedIn) throw new Error("You are not Logged In")
    if (!req.user.details.roles.includes("admit"))
      throw new Error("You are not allowed to add a parent")
    const { name, phone, email, male } = args
    // this password shall be emailed / SMSed to the parent
    const password = moment().format("MMSS")
    let parent = new Parent({
      name,
      phone,
      email,
      male,
      addedBy: "anonymous", //req.user.details.email,
      password,
    })
    try {
      let pr = await parent.save()
      return pr
    } catch (e) {
      throw new Error(e)
    }
  },
}

const parents = {
  type: new GraphQLList(ParentType),
  async resolve() {
    let parents = await Parent.find({})
    return parents
  },
}

const parentLogin = {
  type: AuthParentType,
  args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
  async resolve(_, args) {
    const { email, password } = args
    let par = await Parent.findOne({ email })
    if (!par) throw new Error("Parent not found!")
    if (password !== par.password) throw new Error("Wrong Password")
    let token = await jwt.sign({ name: par.name, email }, process.env.SECRET, {
      expiresIn: "1w",
    })
    await Logger(
      `Parent (${par.name.toUpperCase()}) Logged In at ${moment().format(
        "ddd, DD MMMM YYYY hh:mm:ss a"
      )}`,
      "login",
      email
    )
    return { ...par._doc, authToken: token }
  },
}

const parentLogs = {
  type: new GraphQLList(LogType),
  async resolve(_, __, req) {
    if (!req.parent.loggedIn) throw new Error("You are not logged in")
    let { email } = req.parent.details
    let logs = await Log.find({ email })
    return logs
  },
}

const changePasswordParent = {
  type: ParentType,
  args: {
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(_, args, req) {
    if (!req.parent.loggedIn)
      throw new Error("You are not logged in as a parent")
    let { email } = req.parent.details
    let pare = await Parent.findOne({ email, password: oldPassword })
    if (!pare) throw new Error("Wrong Credentials!")
    let par = await Parent.findOneAndUpdate(
      { email, password: oldPassword },
      { password: newPassword }
    )
    return par
  },
}

const myParentDetails = {
  type: AuthParentType,
  async resolve(_, __, req) {
    let { email } = req.parent.details
    let u = await Parent.findOne({ email })
    return u
  },
}

module.exports = {
  addParent,
  parents,
  parentLogin,
  parentLogs,
  changePasswordParent,
  myParentDetails,
}
