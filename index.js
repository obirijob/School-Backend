const express = require("express")
const expressGraphQL = require("express-graphql").graphqlHTTP
const schema = require("./GraphQL/schema")
const dotenv = require("dotenv")
const Auth = require("./Middlewares/Auth")
const AuthParent = require("./Middlewares/AuthParent")
const cors = require("cors")

dotenv.config()

require("./db")

const port = 2000

const app = express()

app.use(cors())
app.use(
  "/graphql",
  Auth,
  AuthParent,
  expressGraphQL({
    schema,
    graphiql: true,
  })
)

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})
