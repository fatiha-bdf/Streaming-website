const UserDao = require('../../database/UserDao');

async function userChatContact (userId, res) {
    try {
        let user = new UserDao(userId);
        let usersList = await user.getChatContact();
        res.status(200).json({
            code: 200,
            data: usersList,
        })
    } catch (err) {
        console.log("err :", err);
        res.status(200).json({
            code: 500,
            data: [],
        })
    }
}

module.exports = {
    userChatContact
}