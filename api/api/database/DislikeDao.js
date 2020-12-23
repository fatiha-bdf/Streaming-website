'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class dislikeDao {


    constructor(userId) {
        this.userId = userId;
    }


    async countDislikesByUserId() {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as totalDislikes FROM `dislike` WHERE has_been_disliked_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId)])
            let response = await utils.execQuery(preparedQuery);
            resolve(response[0].totalDislikes);
        })
    }

    async userDislikeExist(dislikerId, dislikedId) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as dislikeExist FROM `dislike` WHERE has_been_disliked_user_id=? AND disliker_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(dislikedId), parseInt(dislikerId)])
            let response = await utils.execQuery(preparedQuery);
            response[0].dislikeExist === 0 ? resolve(false)
                : resolve(true);
        })
    }

    async userInsertDislike(dislikerId, dislikedId) {
        return new Promise(async (resolve, reject) => {
            let query = "INSERT INTO `dislike` (disliker_user_id, has_been_disliked_user_id) \
            VALUES (?, ?)";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(dislikerId), parseInt(dislikedId)])
            await utils.execQuery(preparedQuery);
            resolve(true);
        })
    }

    async userRemoveDislike(dislikerId, dislikedId) {
        return new Promise(async (resolve, reject) => {
        let query = "DELETE FROM `dislike` WHERE has_been_disliked_user_id=? AND disliker_user_id=?";
        let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(dislikedId), parseInt(dislikerId)])
        await utils.execQuery(preparedQuery);
        resolve(true);
        })
    }
}