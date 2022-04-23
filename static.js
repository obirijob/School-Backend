const router = require("express").Router()

router.get("/images/noimage", (req, res) => {
  res.sendFile("/noimage.png", { root: "Static" }, e => {
    res.status(404).send(e)
  })
})

module.exports = router
