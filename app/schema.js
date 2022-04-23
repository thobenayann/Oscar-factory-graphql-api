const { gql } = require('apollo-server');

const typeDefs = gql`
type Query{
    getMovie: [String]
}
`;

module.exports = typeDefs;