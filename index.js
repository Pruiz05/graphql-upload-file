const { ApolloServer, gql } = require("apollo-server");
const { createWriteStream } = require("fs");
const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Query {
    uploads: [File]
  }
  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
  Mutation: {
    async uploadFile(parent, { file }) {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      await new Promise((resolve, reject) => {
        stream
          .on("error", (error) => {
            unlink(path, () => {
              reject(error);
            });
          })
          .pipe(createWriteStream(filename))
          .on("error", reject)
          .on("finish", resolve);
      });
      console.log("-----------file written");
      return file;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
