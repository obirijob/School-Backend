const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require("graphql")

const SubjectType = new GraphQLObjectType({
  name: "subjecttype",
  fields: () => ({
    code: { type: GraphQLString },
    label: { type: GraphQLString },
    category: { type: GraphQLString },
    compulsory: { type: GraphQLBoolean },
  }),
})

module.exports = { SubjectType }
