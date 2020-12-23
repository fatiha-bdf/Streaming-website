const userDao = require('../../database/UserDao');

async function updateUSerLogout(userId, res) {
    let user = new userDao();
    if (await user.updateUserOnline(false, userId))
        res.status(200).json({
            code: 200,
            msg: "Success"
        });
    else
        res.status(200).json({
            code: 204,
            msg: "An error occured"
        });

}

module.exports = {
    updateUSerLogout
}