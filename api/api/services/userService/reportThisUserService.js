const ReportDao = require('../../database/ReportDao');
const NotifDao = require('../../database/NotifsDao');
const UserDao = require('../../database/UserDao');
const BlockDao = require('../../database/BlockDao');

async function putReportUser(data, res) {
    let report = new ReportDao(data.reporter_userId);
    let notif = new NotifDao(data.reported_userId);
    let user = new UserDao(data.reporter_userId);
    let block = new BlockDao(data.reported_userId);

    // Report User
    try {
        await report.userInsertReportedProfile(data.reported_userId);
        //Update user fame
        await user.calculateUserFame(data.reported_userId);

        // Check if the liked has blocked the liker
        if (await block.hasUserNotBeenBlocked(data.reporter_userId, data.reported_userId)) {
            // Check if notifs exists
            if (await notif.checkIfNotifExist(data.reporter_userId, "report")) {
                // Yes update seen and updatedAt time stamp
                await notif.updateUserNotif(data.reporter_userId, "report");
            } else {
                // No creat a new notifs
                await notif.userInsertNotification(data.reporter_userId, "report", " reported your profile", "report")
            }
        }

        res.status(200).json({
            msg: "User reported with success",
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
    putReportUser
}