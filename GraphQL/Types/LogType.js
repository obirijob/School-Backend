const UserType = require("../Types/UserType")
const { GraphQLObjectType, GraphQLString } = require("graphql")

LogType = new GraphQLObjectType({
  name: "logtype",
  fields: () => ({
    email: { type: GraphQLString },
    actionType: { type: GraphQLString },
    action: { type: GraphQLString },
  }),
})

module.exports = LogType
