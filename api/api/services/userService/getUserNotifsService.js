const notifDao = require('../../database/NotifsDao');

async function getUserNotifs(userId, res) {
    let notif = new notifDao(userId);

    try {
        let allUsernotifs = await notif.getAllnotifByUserId()
        res.status(200).json({
            msg: "User notifs fetched with success",
            code: 200,
            data: allUsernotifs,
        })
    } catch (err) {
        res.status(200).json({
            msg: "Sorry, an error occured",
            code: 500,
            err: err
        })
    }
}

module.exports = {
    getUserNotifs
}