// In this file we're going to define our schema
// Schema will describe the data

// Describes the object types, the relations between those object types
// and it describes how we can reach into the graph to ineract with that data

const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  // This means that you can never return a null value for this type
  GraphQLNonNull,
} = graphql;

// DUMMY_DATA
let books = [
  {
    id: "1",
    name: "Harry Potter and the Chamber of Secrets",
    genre: "Fantasy Fiction",
    authorId: "1",
  },
  {
    id: "2",
    name: "Harry Potter and the Prisoner of Azkaban",
    genre: "Fantasy Fiction",
    authorId: "1",
  },
  {
    id: "3",
    name: "Harry Potter and the Goblet of Fire",
    genre: "Fantasy Fiction",
    authorId: "1",
  },
  {
    id: "4",
    name: "The Way of Shadows",
    genre: "High fantasy",
    authorId: "2",
  },
  {
    id: "5",
    name: "Beyond the Shadows",
    genre: "High fantasy",
    authorId: "2",
  },
];

const authors = [
  { id: "1", name: "J. K. Rowling", age: 56 },
  { id: "2", name: "Brent Weeks", age: 45 },
];

// This object is going to define what this book type
const BookType = new GraphQLObjectType({
  name: "Book",

  // We have wrapped all of those fields inside a function,
  // because when we have a multiple types this is going to help overcome any kind of reference errors
  fields: () => ({
    // We use GraphQLString, GraphQLID... in order to understand the type
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLNonNull(GraphQLString) },
    author: {
      type: AuthorType,

      // The resolve function is responsible for looking at the actual data and returning what is needed
      // then graphQL takes that data and sends back to the user the exact properties that they wanted from that data

      // Parent parameter, when we have nested data wa already have the parent data
      // On that parent object we have all properties
      resolve(parent, args) {
        // code to get data we need from our database
        console.log(parent);
        return authors.find((author) => author.id === parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLNonNull(GraphQLInt) },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent);
        return books.filter((book) => book.authorId === parent.id);
      },
    },
  }),
});

// RootQuery defines how we can jump into the graph to query data
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // This name (book) matters because when we're trying
    // to query from the front-end this is the name of this parameter
    book: {
      type: BookType,
      // Arguments that we're expecting to come along with the query is an ID
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return books.find((book) => book.id === args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return authors.find((author) => author.id === args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

// Mutations CREATE, UPDATE, and DELETE data stored in the backend.

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const author = new {
          id: authors.length + 1,
          name: args.name,
          age: args.age,
        }();
        authors.push(author);
        return author;
      },
    },
  }),
});

// We're creating a new schema and we're defining which query were allowing the user to use
// when they're making queries from the front-end
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutationType,
});
