const Log = require("../Models/Log")
module.exports = async function (action, actionType, email) {
  try {
    let l = new Log({ action, actionType, email })
    let ll = await l.save()
    return ll
  } catch (e) {}
}
