const jwt = require("jsonwebtoken")
const User = require("../Models/User")

module.exports = async function (req, res, next) {
  try {
    let token = req.headers["auth-token"]
    const user = await jwt.verify(token, process.env.SECRET)
    // check if the user is registered in the db
    // someone may create his/her own token using jwt
    let usr = await User.findOne({ email: user.email })
    if (usr) {
      req.user = {
        loggedIn: true,
        details: user,
      }
    } else {
      req.user = {
        loggedIn: false,
        details: null,
      }
    }
  } catch (e) {
    req.user = {
      loggedIn: false,
      details: null,
    }
  }
  next()
}
