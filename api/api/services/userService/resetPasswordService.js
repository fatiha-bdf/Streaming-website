const userDao = require('../../database/UserDao');
const emailSender = require('../../utils/emailSender');
const userEmailsTemplate = require('../../emailsTemplate/userEmails');

async function resetPassword(emailOrUsername, res) {
    let user = new userDao();

    if (await user.userExist(emailOrUsername)) {
        let newPwd = await user.resetPasswod(emailOrUsername);
        if (newPwd !== false) {
            let userData = await user.getUserByEmailOrUsernameOrId(emailOrUsername);
            let msg = userEmailsTemplate.resetPwdTemplate(newPwd)
            emailSender.sendEmail("MATCHA TEAM", userData[0].email, "Reset password", msg);
            res.status(200).json({
                code: 200,
                msg: "Password initialized succesfully, please check your email address !"
            })
        } else {
            res.status(200).json({
                code: 500,
                msg: "Sorry, an error occured !"
            })
        }
    } else {
        res.status(200).json({
            code: 205,
            msg: "This account does not exist !"
        })
    }

}


module.exports = {
    resetPassword
}