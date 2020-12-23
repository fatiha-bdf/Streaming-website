const VisitDao = require('../../database/VisitDao')
const BlockDao = require('../../database/BlockDao');
const notifDao = require('../../database/NotifsDao');

async function putVisitUser(data, res) {
    let visit = new VisitDao(data.visiter_userId);
    let block = new BlockDao(data.visited_userId);
    let notif = new notifDao(data.visited_userId);

    //visit User
    try {
        // Check if user has been visited
        if (await visit.didUserVisitedProfile(data.visited_userId)) {
            // Check if the liked has blocked the liker
            if (await block.hasUserNotBeenBlocked(data.visiter_userId, data.visited_userId)) {
                // Check if notifs exists
                if (await notif.checkIfNotifExist(data.visiter_userId, "visit")) {
                    // Yes update seen and updatedAt time stamp
                    await notif.updateUserNotif(data.visiter_userId, "visit");
                } else {
                    // No creat a new notifs
                    await notif.userInsertNotification(data.visiter_userId, "visit", " visited your profile", "visit")
                }
                // yes update date
                await visit.updateUserVisit(data.visited_userId) ?
                    res.status(200).json({
                        msg: "User visit updated with success",
                        code: 200
                    })
                    : res.status(200).json({
                        msg: "An error occured",
                        code: 500
                    })
            } else {
                res.status(200).json({
                    msg: "user blocked",
                    code: 200
                })
            }
        } else {
            if (await block.hasUserNotBeenBlocked(data.visiter_userId, data.visited_userId)) {
                // Check if notifs exists
                if (await notif.checkIfNotifExist(data.visiter_userId, "visit")) {
                    // Yes update seen and updatedAt time stamp
                    await notif.updateUserNotif(data.visiter_userId, "visit");
                } else {
                    // No creat a new notifs
                    await notif.userInsertNotification(data.visiter_userId, "visit", " visited your profile", "visit")
                }
                // no insert visit data
                await visit.userInsertVisitedProfile(data.visited_userId)
                res.status(200).json({
                    msg: "User visit saved with success",
                    code: 200
                })
            } else {
                res.status(200).json({
                    msg: "User blocked",
                    code: 200
                })
            }
        }
    } catch (err) {
        res.status(200).json({
            msg: "An error occured",
            code: 500
        })
    }
}

module.exports = {
    putVisitUser
}