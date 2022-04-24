const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql")

const GradeLetterType = new GraphQLObjectType({
  name: "gradeLetterType",
  fields: () => ({
    low: { type: GraphQLInt, min: 0, max: 100 },
    high: { type: GraphQLInt, min: 0, max: 100 },
    letter: {
      type: GraphQLString,
      resolve(_) {
        return _.letter.toUpperCase()
      },
    },
  }),
})

module.exports = GradeLetterType
