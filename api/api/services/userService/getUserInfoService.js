const UserDao = require('..//../database/UserDao');
const TagsDao = require('../../database/TagsDao');
const PicturesDao = require('../../database/PictureDao');
const UtilsDao = require('../../database/utilsDao');
const LikeDao = require('../../database/LikeDao');

async function getUserInfo(sourceUserId, userId, res) {
    let user = new UserDao();
    let tags = new TagsDao(userId);
    let pictures = new PicturesDao(userId);
    let like = new LikeDao(userId);

    try {
        // Check user if exist
        if (await user.userExist(userId)) {
            // Is user liked
            let liked = await like.userLikeExist(userId, sourceUserId);
            // Get user information
            let userInfo = await UtilsDao.userDaoSerializer(await user.getUserByEmailOrUsernameOrId(userId));
            // Get user intrests
            let userInterests = await UtilsDao.interestsSerializer(await tags.getIntrestsNameByUserId(userId));
            // Get user pictures
            let userPictures = await pictures.getPicturesByUserId(userId);
            res.status(200).json({
                code: 200,
                msg: "Data returned with success",
                data: {
                    info: userInfo,
                    pictures: userPictures,
                    tags: userInterests,
                    liked: liked
                }
            })
        } else {
            res.status(200).json({
                code: 204,
                msg: "This account does not exist !"
            })
        }
    } catch (err) {
        res.status(200).json({
            code: 500,
            err: err,
            msg: "Sorry an error occured !"
        })
    }

}

async function getCurrentUserInfo(userId, res) {
    let user = new UserDao();
    let tags = new TagsDao(userId);
    let pictures = new PicturesDao(userId);
    let like = new LikeDao(userId);

    try {
        // Check user if exist
        if (await user.userExist(userId)) {
            // Get user information
            let userInfo = await UtilsDao.userDaoSerializer(await user.getUserByEmailOrUsernameOrId(userId));
            // Get user intrests
            let userInterests = await UtilsDao.interestsSerializer(await tags.getIntrestsNameByUserId(userId));
            // Get user pictures
            let userPictures = await pictures.getPicturesByUserId(userId);
            res.status(200).json({
                code: 200,
                msg: "Data returned with success",
                data: {
                    info: userInfo,
                    pictures: userPictures,
                    tags: userInterests,
                }
            })
        } else {
            res.status(200).json({
                code: 204,
                msg: "This account does not exist !"
            })
        }
    } catch (err) {
        res.status(200).json({
            code: 500,
            err: err,
            msg: "Sorry an error occured !"
        })
    }

}


module.exports = {
    getUserInfo,
    getCurrentUserInfo
}