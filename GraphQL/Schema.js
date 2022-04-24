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
const {
  addStudent,
  students,
  singleStudent,
} = require("./Resolvers/StudentResolver")
const {
  classes,
  addClass,
  assignStudentToClass,
  myClass,
} = require("./Resolvers/DarasaResolver")
const {
  addSubject,
  subjects,
  compulsorySubjects,
  studentAddSubject,
  studentRemoveSubject,
} = require("./Resolvers/SubjectResolver")
const {
  addGradeLetter,
  gradeLetters,
  getGrade,
} = require("./Resolvers/GradeLetterResolver")

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
    classes,
    singleStudent,
    myClass,
    subjects,
    compulsorySubjects,
    gradeLetters,
    getGrade,
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
    addClass,
    assignStudentToClass,
    addSubject,
    studentAddSubject,
    studentRemoveSubject,
    addGradeLetter,
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
})
