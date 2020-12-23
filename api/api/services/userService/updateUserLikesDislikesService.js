const likeDao = require('../../database/LikeDao');
const dislikeDao = require('../../database/DislikeDao');
const notifDao = require('../../database/NotifsDao');
const UserDao = require('../../database/UserDao');
const BlockDao = require('../../database/BlockDao');
const UnlikeDao = require('.././../database/UnlikeDao');

async function putUserLikesDislikes(checker, data, res) {
    let like = new likeDao(data.liker_user_id);
    let dislike = new dislikeDao(data.liker_user_id);
    let notif = new notifDao(data.has_been_liked_user_id);
    let user = new UserDao(data.liker_user_id);
    let block = new BlockDao(data.has_been_liked_user_id);

    // if check === 0 handle likes
    if (parseInt(checker) === 0) {
        // Check if like exist
        if (await like.userLikeExist(data.liker_user_id, data.has_been_liked_user_id)) {
            // Remove the like
            await like.userRemoveLike(data.liker_user_id, data.has_been_liked_user_id);
            res.status(200).json({
                code: 200,
                msg: "Like removed"
            })
        } else {
            // Add the like
            await like.userInsertLike(data.liker_user_id, data.has_been_liked_user_id);
            //Update user fame
            await user.calculateUserFame(data.has_been_liked_user_id);
            // Check if the liked has blocked the liker
            if (await block.hasUserNotBeenBlocked(data.liker_user_id, data.has_been_liked_user_id)) {
                // Check if notifs exists
                if (await notif.checkIfNotifExist(data.liker_user_id, "like")) {
                    // Yes update seen and updatedAt time stamp
                    await notif.updateUserNotif(data.liker_user_id, "like");
                } else {
                    // No creat a new notifs
                    await notif.userInsertNotification(data.liker_user_id, "like", " liked your profile", "like")
                }
            }
            res.status(200).json({
                code: 200,
                msg: "Like added"
            })
        }
        // if check === 1 handle dislikes
    } else if (parseInt(checker) === 1) {
        if (await dislike.userDislikeExist(data.liker_user_id, data.has_been_liked_user_id)) {
            await dislike.userRemoveDislike(data.liker_user_id, data.has_been_liked_user_id);
            res.status(200).json({
                code: 200,
                msg: "Dislike removed"
            })
        } else {
            //Add a new dislike
            await dislike.userInsertDislike(data.liker_user_id, data.has_been_liked_user_id);
            //Update user fame
            await user.calculateUserFame(data.has_been_liked_user_id);
            if (await block.hasUserNotBeenBlocked(data.liker_user_id, data.has_been_liked_user_id)) {
                // Check if notifs exists
                if (await notif.checkIfNotifExist(data.liker_user_id, "dislike")) {
                    // Yes update seen and updatedAt time stamp
                    await notif.updateUserNotif(data.liker_user_id, "dislike");
                } else {
                    // No creat a new notifs
                    await notif.userInsertNotification(data.liker_user_id, "dislike", " disliked your profile", "dislike")
                }
            }
            res.status(200).json({
                code: 200,
                msg: "Dislike added"
            })
        }

    }
}

async function putUserUnlikes(data, res) {
    let unlike = new UnlikeDao(data.unliker_user_id);
    let notif = new notifDao(data.has_been_unliked_user_id);
    let user = new UserDao(data.unliker_user_id);
    let block = new BlockDao(data.has_been_unliked_user_id);

    // Check if like exist
    if (await unlike.userunlikeExist(data.unliker_user_id, data.has_been_unliked_user_id)) {
        // Remove the like
        await unlike.userRemoveunlike(data.unliker_user_id, data.has_been_unliked_user_id);
        res.status(200).json({
            code: 200,
            msg: "Unlike removed"
        })
    } else {
        // Add the unlike
        await unlike.userInsertunlike(data.unliker_user_id, data.has_been_unliked_user_id);
        // Check if the unliked has blocked the liker
        if (await block.hasUserNotBeenBlocked(data.unliker_user_id, data.has_been_unliked_user_id)) {
            // Check if notifs exists
            if (await notif.checkIfNotifExist(data.unliker_user_id, "unlike")) {
                // Yes update seen and updatedAt time stamp
                await notif.updateUserNotif(data.unliker_user_id, "unlike");
            } else {
                // No creat a new notifs
                await notif.userInsertNotification(data.unliker_user_id, "unlike", " unliked your profile", "unlike")
            }
        }
        res.status(200).json({
            code: 200,
            msg: "Unlike added"
        })
    }
}

module.exports = {
    putUserLikesDislikes,
    putUserUnlikes
}