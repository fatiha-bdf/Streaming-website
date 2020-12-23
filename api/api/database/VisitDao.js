'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class visitDao {

    constructor(userId) {
        this.userId = userId;
    }

    async didUserVisitedProfile(visited_userId) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT * FROM `visit` WHERE visiter_user_id=? AND visited_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId), parseInt(visited_userId)])
            let response = await utils.execQuery(preparedQuery);
            response.length === 0 ? resolve(false) : resolve(true);
        })
    }

    async countVisitsByUserId() {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as totalVisits FROM `visit` WHERE visited_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId)])
            let response = await utils.execQuery(preparedQuery);
            resolve(response[0].totalVisits);
        })
    }

    async updateUserVisit(visited_userId) {
        return new Promise(async (resolve, reject) => {
            var date = new Date();
            let infoDate = date.toISOString().split('T')[0] + ' '
                + date.toTimeString().split(' ')[0];
            let query = "UPDATE `visit` SET visit_date=?, updatedAt=? WHERE visiter_user_id=? AND visited_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [infoDate, infoDate, parseInt(this.userId), parseInt(visited_userId)])
            let response = await utils.execQuery(preparedQuery);
            if (response.affectedRows !== undefined && response.affectedRows === 1)
                resolve(true);
            else
                resolve(false);
        })
    }

    async userInsertVisitedProfile(visited_userId) {
        return new Promise(async (resolve, reject) => {
            let query = "INSERT INTO `visit` (visiter_user_id, visited_user_id) \
            VALUES (?, ?)";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId), parseInt(visited_userId)])
            await utils.execQuery(preparedQuery);
            resolve(true);
        })
    }

}