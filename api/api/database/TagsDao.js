'use strict';
const db = require('../../config/dbConnection');
const prepareQuery = require('../utils/prepareQuery');
const utils = require('./utilsDao');

module.exports = class tagsDao {
    constructor(userId) {
        this.userId = userId;
    }

    async ifExistTagByName(tagName) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT * FROM interests WHERE name=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [tagName])
            let response = await utils.execQuery(preparedQuery);
            response.length === 0 ? resolve(false) : resolve(true);
        })
    }

    async getAllTags() {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT * FROM interests WHERE deleted=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, ['0'])
            let response = await utils.execQuery(preparedQuery);
            resolve(response);   
        })
    }

    async addNewTag(name) {
        let query = `INSERT INTO interests (name) \
        VALUES (?)`;
        let preparedQuery = await prepareQuery.prepareQuery(query, [name])
        await utils.execQuery(preparedQuery);
    }

    async getTagIdByName(name) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT * FROM interests WHERE name=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [name])
            let response = await utils.execQuery(preparedQuery);
            resolve(response[0].id);
        })
    }

    async getTagsByUserId(userId) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT * FROM user_has_interests WHERE user_id=?";
            let preparedQuery = await prepareQuery.prepareQuery(query, [userId])
            let response = await utils.execQuery(preparedQuery);
            resolve(response);
        })
    }

    async deleteAllUserIntrests() {
        let query = `DELETE FROM user_has_interests WHERE user_id=?`;
        let preparedQuery = await prepareQuery.prepareQuery(query, [parseInt(this.userId)])
        await utils.execQuery(preparedQuery);
    }

    async saveUserInterestsList(tagId) {
        let query = `INSERT INTO user_has_interests (user_id, interests_id) \
        VALUES (?, ?)`;
        let preparedQuery = await prepareQuery.prepareQuery(query, [this.userId, tagId])
        await utils.execQuery(preparedQuery);
    }

    async getIntrestsNameByUserId(userId) {
        return new Promise(async (resolve, reject) => {
            let query = "SELECT interests.name FROM user_has_interests INNER JOIN interests \
            ON user_has_interests.interests_id=interests.id WHERE user_has_interests.user_id=?;";
            let preparedQuery = await prepareQuery.prepareQuery(query, [userId])
            let response = await utils.execQuery(preparedQuery);
            resolve(response);
        })
    }

    async updateTags(tags, dataType) {
        // If it is an array
        if (dataType === 'arr') {
            // Empty user intrest list
            await this.deleteAllUserIntrests();
            // If tag does not exist in tags list create a new tag
            tags.forEach(async tag => {
                if (await this.ifExistTagByName(tag) === false) {
                    await this.addNewTag(tag)
                }
                // Get tag id
                const tagId = await this.getTagIdByName(tag);
                // Save user tags
                await this.saveUserInterestsList(tagId);
            });
        } else {
            if (tags === "" || tags === undefined) {
                await this.deleteAllUserIntrests();
            } else {
                await this.deleteAllUserIntrests();
                // If tag does not exist in tags list create a new tag
                if (await this.ifExistTagByName(tags) === false) {
                    await this.addNewTag(tags)
                }
                // Get tag id
                const tagId = await this.getTagIdByName(tags);
                // Save user tags
                await this.saveUserInterestsList(tagId);
            }
        }
    }
}