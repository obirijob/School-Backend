const jwt = require("jsonwebtoken")
const Parent = require("../Models/Parent")

module.exports = async function (req, res, next) {
  try {
    let token = req.headers["auth-token"]
    const user = await jwt.verify(token, process.env.SECRET)
    // check if parent is in db
    let par = await Parent.findOne({ email: user.email })
    if (par) {
      req.parent = {
        loggedIn: true,
        details: user,
      }
    } else {
      req.parent = {
        loggedIn: false,
        details: null,
      }
    }
  } catch (e) {
    req.parent = {
      loggedIn: false,
      details: null,
    }
  }
  next()
}
