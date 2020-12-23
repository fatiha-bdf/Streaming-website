'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class unlikeDao {

    constructor(userId) {
        this.userId = userId;
    }


    async countunlikesByUserId() {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as totalunlikes FROM `unlike` WHERE has_been_unliked_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId)])
            let response = await utils.execQuery(preparedQuery);
            resolve(response[0].totalunlikes);
        })
    }

    async userunlikeExist(unlikerId, unlikedId) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as unlikeExist FROM `unlike` WHERE has_been_unliked_user_id=? AND unliker_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(unlikedId), parseInt(unlikerId)])
            let response = await utils.execQuery(preparedQuery);
            response[0].unlikeExist === 0 ? resolve(false)
                : resolve(true);
        })
    }

    async userInsertunlike(unlikerId, unlikedId) {
        return new Promise(async (resolve, reject) => {
            let query = "INSERT INTO `unlike` (unliker_user_id, has_been_unliked_user_id) \
            VALUES (?, ?)";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(unlikerId), parseInt(unlikedId)])
            await utils.execQuery(preparedQuery);
            resolve(true);
        })
    }

    async userRemoveunlike(unlikerId, unlikedId) {
        return new Promise(async (resolve, reject) => {
        let query = "DELETE FROM `unlike` WHERE has_been_unliked_user_id=? AND unliker_user_id=?";
        let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(unlikedId), parseInt(unlikerId)])
        await utils.execQuery(preparedQuery);
        resolve(true);
        })
    }

}