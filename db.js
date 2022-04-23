const mongoose = require("mongoose")

// connect to mongodb locally
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected Successfully")
  })
  .catch((e) => {
    console.log(`Failed to connect to db \n\n${e.toString()}`)
  })
