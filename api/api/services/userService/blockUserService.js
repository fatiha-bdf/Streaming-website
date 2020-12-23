const BlockDao = require('../../database/BlockDao');
const NotifDao = require('../../database/NotifsDao');
const UserDao = require('../../database/UserDao');

async function blockThisUser(data, res) {
    let block = new BlockDao(data.blocker_userId);
    let notif = new NotifDao(data.blocked_userId);
    let user = new UserDao(data.blocker_userId);

    //Block User
    try {
        await block.userInsertBlockedProfile(data.blocked_userId);
        //Update user fame
        await user.calculateUserFame(data.blocked_userId);
        // Check if user blocked
        if (await block.hasUserNotBeenBlocked(data.blocked_userId, data.blocker_userId)) {
            // Check if notifs exists
            if (await notif.checkIfNotifExist(data.blocker_userId, "block")) {
                // Yes update seen and updatedAt time stamp
                await notif.updateUserNotif(data.blocker_userId, "block");
            } else {
                // No creat a new notifs
                await notif.userInsertNotification(data.blocker_userId, "block", " blocked your profile", "block")
            }
        }

        res.status(200).json({
            msg: "User blocked with success",
            code: 200
        })
    } catch (err) {
        res.status(200).json({
            msg: "An error occured",
            code: 500
        })
    }

}

module.exports = {
    blockThisUser
}