'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class messageDao {

    constructor(userId) {
        this.userId = userId;
    }

    async userInsertMessage(data) {
        return new Promise(async (resolve, reject) => {
            let query = "INSERT INTO `message` (message_text, source_user_id, destination_user_id) \
            VALUES (?, ?, ?)";
            let preparedQuery = await prepareQuery.prepareQuery(query, [data.messages[data.messages.length - 1].msgData, data.source_userId, data.dest_userId])
            await utils.execQuery(preparedQuery);
            resolve(true);
        })
    }

    async getMsgByuserId(desUserId) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT * FROM `message` WHERE (source_user_id=? AND destination_user_id=?) OR \
            (source_user_id=? AND destination_user_id=?) ORDER BY createdAt";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId), parseInt(desUserId), parseInt(desUserId), parseInt(this.userId)])
            let response = await utils.execQuery(preparedQuery);
            resolve(response);
        })
    }


}