'use strict';
const db = require('../../config/dbConnection');

async function prepareQuery (query, ...args) {
    return new Promise((resolve, reject) => {
        let preparedQuery = db.format(query, ...args);    
        resolve(preparedQuery);
    })
}

module.exports = {
    prepareQuery
}