const { UserInputError } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');

function yearValue(value) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 1900 && value <= 2100) {
        return value;
    }
    throw new UserInputError('Provided value is not a valid year');
}

module.exports = new GraphQLScalarType({
    name: 'Year',
    description: 'The Year scalar type represents non-fractional unsigned whole numeric values. Year can represent values between 1900 and 2100.',
    // Sortie
    serialize: yearValue,
    // Entrée avec variable
    parseValue: yearValue,
    // Entrée sans variable
    parseLiteral(ast) {
        // ast.kind est le type de la valeur determinée par Apollo
        // ast.value la valeur en string
        if (ast.kind === Kind.INT) {
            return yearValue(parseInt(ast.value, 10));
        }
        throw new UserInputError('Provided literal value is not a valid year');
    },
});
