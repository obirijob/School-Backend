const { GraphQLString, GraphQLList } = require("graphql")
const User = require("../../Models/User")
const UserType = require("../Types/UserType")
const AuthUserType = require("../Types/AuthUserType")
const jwt = require("jsonwebtoken")
const Log = require("../../Models/Log")
const moment = require("moment")
const Logger = require("../../Helpers/Logger")

const addUser = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args, req) {
    if (!req.user.loggedIn) throw new Error("You are not Logged in")
    if (!req.user.details.roles.includes("principal"))
      throw new Error("You are not allowed to add a user")
    const { name, email, password } = args
    const user = new User({
      name,
      email,
      password,
    })
    try {
      let u = await user.save()
      return u
    } catch (e) {
      throw new Error(e)
    }
  },
}

const assignRoles = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    roles: { type: new GraphQLList(GraphQLString) },
  },
  async resolve(_, args) {
    if (!req.user.loggedIn) throw new Error("You are not Logged in")
    if (!req.user.details.roles.includes("principal"))
      throw new Error("You are not allowed to assign roles")
    const { email, roles } = args
    const user = await User.findOne({ email })
    if (!user) throw new Error(`User of email "${email}" not found`)
    try {
      const us = await User.findOneAndUpdate({ email }, { roles })
      return us
    } catch (e) {
      throw new Error(`Failed to update user roles \n${e.toString()}`)
    }
  },
}

const logIn = {
  type: AuthUserType,
  args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
  async resolve(_, args, req) {
    const { email, password } = args
    const user = await User.findOne({ email })
    if (!user) throw new Error("User Not Found")
    if (user.password !== password) throw new Error("Invalid Password")
    let log = new Log({
      email,
      actionType: "login",
      action: `Logged In at ${moment().format("ddd, DD MMMM YYYY hh:mm:ss a")}`,
    })
    await log.save()
    const token = await jwt.sign(
      { name: user.name, email, roles: user.roles },
      process.env.SECRET,
      { expiresIn: "3h" }
    )
    return { ...user._doc, authToken: token }
  },
}

const changePassword = {
  type: UserType,
  args: {
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(_, args, req) {
    if (!req.user.loggedIn) throw new Error("You are not Logged in")
    const { email } = req.user.details
    const { oldPassword, newPassword } = args
    let user = await User.findOne({ email })
    if (!user) throw new Error("Invalid Credentials")
    if (user.password !== oldPassword) throw new Error("Invalid Credentials")
    const user2 = await User.findOneAndUpdate(
      { email, password: oldPassword },
      { password: newPassword }
    )
    await Logger(`Changed Password`, `login`, email)
    return user2
  },
}

const loggedInAs = {
  type: GraphQLString,
  resolve(_, args, req) {
    if (req.user.loggedIn || req.parent.loggedIn) {
      if (req.user.loggedIn) {
        return "staff"
      } else if (req.parent.loggedIn) {
        return "parent"
      } else {
        return "none"
      }
    } else {
      return "none"
    }
  },
}

const myUserDetails = {
  type: AuthUserType,
  async resolve(_, __, req) {
    let { email } = req.user.details
    let u = await User.findOne({ email })
    return u
  },
}

module.exports = {
  addUser,
  assignRoles,
  logIn,
  changePassword,
  loggedInAs,
  myUserDetails,
}
