'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class notifDao {

    constructor(userId) {
        this.userId = userId;
    }

    async getAllnotifByUserId() {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT concat(user.lastname, ' ', user.firstname) as fullname, \
            user.id, notif.seen, notif.categorie, notif.description, notif.updatedAt FROM `notif` \
            LEFT JOIN  `user` \
            ON user.id = notif.action_user_id \
            WHERE notified_user_id=? AND deleted=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId), 0]);
            let response = await utils.execQuery(preparedQuery);
            response.length === 0 ? resolve([]) : resolve(response);
        })
    }
    
    async checkIfNotifExist(action_userId, title) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT * FROM `notif` WHERE title=? AND notified_user_id=? AND action_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [title, parseInt(this.userId), parseInt(action_userId)]);
            let response = await utils.execQuery(preparedQuery);
            response.length === 0 ? resolve(false) : resolve(true);
        })
    }

    async updateUserNotif(action_userId, title) {
        return new Promise(async (resolve, reject) => {
            var date = new Date();
            let infoDate = date.toISOString().split('T')[0] + ' '
                + date.toTimeString().split(' ')[0];

            let query = "UPDATE `notif` SET seen=?, updatedAt=? WHERE title=? AND notified_user_id=? AND action_user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [0, infoDate, title, parseInt(this.userId), parseInt(action_userId)])
            let response = await utils.execQuery(preparedQuery);
            if (response.affectedRows !== undefined && response.affectedRows === 1)
                resolve(true);
            else
                resolve(false);
        })
    }

    async userInsertNotification(action_userId, title, description, categorie) {
        return new Promise(async (resolve, reject) => {
            let query = "INSERT INTO `notif` (notified_user_id, action_user_id, title, description, categorie) \
            VALUES (?, ?, ?, ?, ?)";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId), parseInt(action_userId), title, description, categorie])
            await utils.execQuery(preparedQuery);
            resolve(true);
        })
    }

}