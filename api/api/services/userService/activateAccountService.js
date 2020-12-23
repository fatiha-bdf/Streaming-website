const jwt = require('jsonwebtoken');
const useRDao = require('..//../database/UserDao');

async function activateAccount(activationToken, res) {
    let decode = jwt.decode(activationToken)
    let user = new useRDao();
    if (decode === null) {
        res.send("Not valid token, this incident will be repported");
    } else if (await user.activateAccount(decode.email, activationToken))
        res.send("Email validatation confirmed");
    else
        res.send("Not valid token, this incident will be repported");
}

module.exports = {
    activateAccount
}