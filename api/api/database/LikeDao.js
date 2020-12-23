'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class likeDao {

    constructor(userId) {
        this.userId = userId;
    }


    async countLikesByUserId() {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as totalLikes FROM `like` WHERE has_been_liked_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId)])
            let response = await utils.execQuery(preparedQuery);
            resolve(response[0].totalLikes);
        })
    }

    async userLikeExist(likerId, likedId) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT count(*) as likeExist FROM `like` WHERE has_been_liked_user_id=? AND liker_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(likedId), parseInt(likerId)])
            let response = await utils.execQuery(preparedQuery);
            response[0].likeExist === 0 ? resolve(false)
                : resolve(true);
        })
    }

    async userInsertLike(likerId, likedId) {
        return new Promise(async (resolve, reject) => {
            let query = "INSERT INTO `like` (liker_user_id, has_been_liked_user_id) \
            VALUES (?, ?)";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(likerId), parseInt(likedId)])
            await utils.execQuery(preparedQuery);
            resolve(true);
        })
    }

    async userRemoveLike(likerId, likedId) {
        return new Promise(async (resolve, reject) => {
        let query = "DELETE FROM `like` WHERE has_been_liked_user_id=? AND liker_user_id=?";
        let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(likedId), parseInt(likerId)])
        await utils.execQuery(preparedQuery);
        resolve(true);
        })
    }

}