// First we need to install:

// npm install express
// npm install express-graphql
// npm install graphql

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

// We'll invoke the express function to create our app
const app = express();

// Bind express with graphql
app.use(
  "/graphql",
  graphqlHTTP({
    // Pass in a schema property
    schema,
    // We want to use the graphical tool in the browser
    graphiql: true,
  })
);

//GraphiQL is useful during testing and development but should be disabled in production by default. If you are using express-graphql, you can toggle it based on the NODE_ENV environment variable:

// app.use('/graphql', graphqlHTTP({
//   schema: MySessionAwareGraphQLSchema,
//   graphiql: process.env.NODE_ENV === 'development',
// }));

// Tell our app to listen to a specific port
app.listen(4000, () => {
  console.log("now listening for requests on port 4000");
});
