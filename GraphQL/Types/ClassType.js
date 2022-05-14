const { GraphQLString, GraphQLInt, GraphQLObjectType } = require("graphql")
const ClassType = new GraphQLObjectType({
  name: "classtype",
  fields: () => ({
    level: { type: GraphQLInt },
    label: { type: GraphQLString },
  }),
})

module.exports = { ClassType }
