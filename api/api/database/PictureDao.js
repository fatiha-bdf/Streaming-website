'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class pictureDao {

    constructor(userId) {
        this.userId = userId;
    }

    async deleteUserPictures() {
        let query = `DELETE FROM picture WHERE user_id=?`;
        let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId)])
        await utils.execQuery(preparedQuery);
    }

    async updateUserPictures(path, state) {
        let query = `INSERT INTO picture (path, state, user_id) \
        VALUES (?, ?, ?)`;
        let preparedQuery = await prepareQuery.prepareQuery(query, [path, state, parseInt(this.userId)])
        await utils.execQuery(preparedQuery);
    }

    async getPicturesByUserId(userId) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT picture.path, picture.state FROM picture WHERE user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [userId])
            let response = await utils.execQuery(preparedQuery);
            resolve(response);
        })
    }

    async getPictureByUserIdAndState(userId, state) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT picture.path as PhotoProfile FROM picture WHERE user_id=? AND state=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(userId), state])
            let response = await utils.execQuery(preparedQuery);
            console.log("response[0].PhotoProfile :", response.length)
            if (response.length > 0)
                resolve(response[0].PhotoProfile);
            else resolve("");
        })
    }

    async updatePictures(pictures, profilePicture) {
        let check = 0;
        // Remove all pictures.
        await this.deleteUserPictures();
        // Check profile picture
        if (profilePicture === "") {
            // update pictures
            Array.from(pictures).map(async element => {
                await this.updateUserPictures(element.path, 0);
            });
        }
        else {
            //update pictures
            Array.from(pictures).map(async element => {
                if (element.originalname === profilePicture && check === 0) {
                    await this.updateUserPictures(element.path, 1);
                    check = 1;
                } else
                    await this.updateUserPictures(element.path, 0);
            });
        }
    }
}