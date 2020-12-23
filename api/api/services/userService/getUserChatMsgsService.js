const MessageDao = require('../../database/MessageDao');

async function userChatMsgs (desUserId, userId, res) {
    try {
        let message = new MessageDao(userId);
        let allMessages = await message.getMsgByuserId(desUserId)
        res.status(200).json({
            code: 200,
            data: allMessages,
            msg: "Msg fetched with success"
        })
    } catch(err) {
        console.log("Err :", err)
        res.status(200).json({
            code: 500,
            err: err,
            msg: "Sorry an error occured !"
        })
    }


} 

module.exports = {
    userChatMsgs
}