const MessageDao = require('../../database/MessageDao');
const notifDao = require('../../database/NotifsDao');
const BlockDao = require('../../database/BlockDao');

async function saveUserChatContact(data, res) {
    try {
        let message = new MessageDao(data.source_userId);
        let notif = new notifDao(data.dest_userId);
        let block = new BlockDao(data.dest_userId);

        if (await block.hasUserNotBeenBlocked(data.source_userId, data.dest_userId)) {
            // Creat a new notifs
            await notif.userInsertNotification(data.source_userId, "message", " sent you a new message", "message")

            await message.userInsertMessage(data);
        }
        
        res.status(200).json({
            code: 200,
            msg: "Msg saved with success"
        })
    } catch (err) {
        console.log("Err : ", err);
        res.status(200).json({
            code: 500,
            msg: "Sorry an error occured !"
        })
    }
}

module.exports = {
    saveUserChatContact
}