const { GraphQLString, GraphQLObjectType, GraphQLSchema } = require("graphql")
const {
  addUser,
  assignRoles,
  logIn,
  changePassword,
  loggedInAs,
  myUserDetails,
} = require("./Resolvers/UserResolver")
const {
  parents,
  addParent,
  parentLogin,
  parentLogs,
  changePasswordParent,
  myParentDetails,
} = require("./Resolvers/ParentResolver")
const { addStudent, students } = require("./Resolvers/StudentResolver")

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    loggedInAs,
    logIn,
    parents,
    students,
    parentLogin,
    parentLogs,
    myUserDetails,
    myParentDetails,
  },
})

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    addUser,
    assignRoles,
    changePassword,
    addParent,
    addStudent,
    changeParentPassword: changePasswordParent,
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
})
