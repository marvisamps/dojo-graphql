const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');

const typeDefs = gql`
  type Gym {
    id: Int
    title: String
    logo: String
    products: [Activity]
    activities: [Activity] @deprecated(reason: "Use otherField instead.")
    rating: Float
    address: String
    location: Location
  }

  type Activity {
    id: Int
    title: String
  }

  type Location {
    latitude: Float
    longitude: Float
  }

  type Query {
    gyms(id: Int): [Gym]
  }
`;

const resolvers = {
  Query: {
    gyms: (obj, args, context, info) =>
      fetch('https://gympass-test.herokuapp.com/gyms')
        .then(response => response.json())
        .then(json => json.map(gym => ({ ...gym, products: gym.activities })))
        .catch(error => {
          throw new Error('DEU RUIM TIO!');
        })
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
