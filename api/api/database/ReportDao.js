'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class reportDao {

    constructor(userId) {
        this.userId = userId;
    }

    async countReportByUserId() {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as totalReports FROM `report` WHERE reported_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId)])
            let response = await utils.execQuery(preparedQuery);
            resolve(response[0].totalReports);
        })
    }

    async userInsertReportedProfile(reported_userId) {
        return new Promise(async (resolve, reject) => {
            let query = "INSERT INTO `report` (reporter_user_id, reported_user_id) \
            VALUES (?, ?)";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId), parseInt(reported_userId)])
            await utils.execQuery(preparedQuery);
            resolve(true);
        })
    }
}