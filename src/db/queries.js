const pgp = require('pg-promise')();

const queries = {
  insert: (table, data) => {
    const tableName = new pgp.helpers.TableName(table);
    const query = `${pgp.helpers.insert(data, null, tableName)} RETURNING id`;
    return query;
  },
  selectAll: (table) => {
    const query = `SELECT * FROM ${table}`;
    return query;
  },
  selectID: (table, id) => {
    const query = `SELECT * FROM ${table} WHERE ID = ${id}`;
    return query;
  },
  deleteID: (table, id) => {
    const query = `DELETE FROM ${table} WHERE ID = ${id}`;
    return query;
  }
};

module.exports = queries;
