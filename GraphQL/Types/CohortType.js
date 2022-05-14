const { GraphQLObjectType, GraphQLInt, GraphQLString } = require("graphql")
const Darasa = require("../../Models/Darasa")
const { ClassType } = require("./ClassType")

const CohortType = new GraphQLObjectType({
  name: "cohorttype",
  fields: () => ({
    _id: { type: GraphQLString },
    classs: {
      type: ClassType,
      async resolve(_) {
        const cls = await Darasa.findOne({
          level: _.classs,
        })
        return cls
      },
    },
    id: { type: GraphQLInt },
    label: { type: GraphQLString },
    term1Fees: { type: GraphQLInt },
    term2Fees: { type: GraphQLInt },
    term3Fees: { type: GraphQLInt },
    term1Start: { type: GraphQLString },
    term2Start: { type: GraphQLString },
    term3Start: { type: GraphQLString },
    term1End: { type: GraphQLString },
    term2End: { type: GraphQLString },
    term3End: { type: GraphQLString },
  }),
})

module.exports = { CohortType }
