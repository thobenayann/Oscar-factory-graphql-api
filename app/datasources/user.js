const CoreSQLDataSource = require('./core/sql');

class User extends CoreSQLDataSource {
    tableName = 'user';
}

module.exports = User;
