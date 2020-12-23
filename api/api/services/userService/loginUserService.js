const userDao = require('../../database/UserDao');
const verifyPwd = require('../../utils/passwordMatchVerification');
const genJwtToke = require('../../utils/generateJwtToken');

async function loginUserAuth(userInfo, res) {
    let user = new userDao();
    if (await user.userExist(userInfo.email)) {
        let userData = await user.getUserByEmailOrUsernameOrId(userInfo.email);
        if (userData[0].validated === 0) {
            res.status(200).json({
                code: 204,
                msg: "Please confirme your email validation !"
            });
        } else if (await verifyPwd.passwordMatchVerification(userInfo.password, userData[0].password)) {
            let token = await genJwtToke.generateJwttoken(userData[0].id, userData[0].email)
            if (await user.updateUserOnline(true, userInfo.email))
                res.status(200).json({
                    code: 200,
                    token: token,
                    userId: userData[0].id
                });
            else
                res.status(200).json({
                    code: 204,
                    msg: "Email and/or password and/or username are incorrect"
                });
        } else {
            res.status(200).json({
                code: 204,
                msg: "Email and/or password and/or username are incorrect"
            });
        }

    } else {
        res.status(200).json({
            code: 204,
            msg: "Email and/or password and/or username are incorrect"
        });
    }
}

module.exports = {
    loginUserAuth
}