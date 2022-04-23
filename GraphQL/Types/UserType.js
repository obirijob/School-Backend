const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql")
const Log = require("../../Models/Log")
const LogType = require("./LogType")

const UserType = new GraphQLObjectType({
  name: "usertype",
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: {
      type: GraphQLString,
      resolve() {
        return "****HIDDEN****"
      },
    },
    roles: { type: new GraphQLList(GraphQLString) },
    photo: { type: GraphQLString },
    logs: {
      type: new GraphQLList(LogType),
      async resolve(_) {
        let { email } = _
        let logs = await Log.find({ email })
        return logs
      },
    },
  }),
})

module.exports = UserType
