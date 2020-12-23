const query_table = require('./configDatabase');

initDatabaseTables = (db) => {
    let queryTable = query_table.databaseTableList();
    queryTable.map(queryEntiity => {
        db.query(queryEntiity.table, function (error, result) {
            if (error) throw error;
            console.log('TABLE CREATED SUCCESSFULLY : ', queryEntiity.name );
        });
    })
}


module.exports = {
    initDatabaseTables
}