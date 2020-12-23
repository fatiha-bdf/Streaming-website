'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class blockDao {

    constructor(userId) {
        this.userId = userId;
    }

    async countBlokesByUserId() {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as totalBlocks FROM `block` WHERE blocked_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId)])
            let response = await utils.execQuery(preparedQuery);
            resolve(response[0].totalBlocks);
        })
    }

    async userInsertBlockedProfile(blocked_userId) {
        return new Promise(async (resolve, reject) => {
            let query = "INSERT INTO `block` (blocker_user_id, blocked_user_id) \
            VALUES (?, ?)";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId), parseInt(blocked_userId)])
            await utils.execQuery(preparedQuery);
            resolve(true);
        })
    }

    async hasUserNotBeenBlocked(blocked_userId, blocker_userId) {
        return new Promise(async (resolve, reject) => {
            console.log("blocker_userId :", blocker_userId)
            let query = "SELECT * FROM `block` WHERE blocker_user_id=? AND blocked_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(blocker_userId), parseInt(blocked_userId)])
            let reponse = await utils.execQuery(preparedQuery);
            console.log("reponse.length ", reponse.length);
            reponse.length === 0 ? resolve(true) : resolve(false) ;
        })
    }

}