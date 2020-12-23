const userDao = require("../../database/UserDao");
const userEmailsTemplate = require('../../emailsTemplate/userEmails');
const emailSender = require('../../utils/emailSender');
const genJwtToken = require('../../utils/generateJwtToken');

async function registerNewUser (req, res) {
    let user = new userDao();
    let uuid  = await user.getAccountValidationToken();

    if (await user.userExist(req.body.email) === false) {
        let token = await genJwtToken.generateJwttoken(uuid, req.body.email);
        await user.insert(req.body, token);
        let msg = userEmailsTemplate.accountCreationToken(token)
        
        emailSender.sendEmail("MATCHA TEAM", req.body.email, "Bienvenu !", msg);

        res.status(200).json({
            code: 200,
            msg: "Account created succesfully, please check your email for validatoion"
        })        
    }
    else {
        res.status(200).json({
            code: 204,
            msg: "This Email exist !"
        })
    }
}

module.exports = {
    registerNewUser
}