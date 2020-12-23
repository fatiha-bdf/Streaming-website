const userService = require('../services/userService/index')

loginUser = (req, res, next) => {
    userService.loginUser.loginUserAuth(req.body.credentials, res);
};

registerUser = (req, res, next) => {
    userService.registerUser.registerNewUser(req, res);
}

activateUserAccount = (req, res, next) => {
    let activationToken = req.params.token;
    userService.activateAccount.activateAccount(activationToken, res)
}

restUserPassword = (req, res, next) => {
    userService.resetPassword.resetPassword(req.body.emailOrUsername, res)
}

editPrfile = (req, res, next) => {
    let userId = req.params.userId;
    userService.updateUserProfile.updateUserProfile(req.body, req.files, userId, res);
}

getProfileInfo = (req, res, next) => {
    let userId = req.params.userId;
    let sourceUserId = req.params.sourceUserId;

    userService.getUserInfoService.getUserInfo(sourceUserId, userId, res);
}

getCurrentProfileInfo = (req, res, next) => {
    let userId = req.params.userId;

    userService.getUserInfoService.getCurrentUserInfo(userId, res);
}


getUserInterests = (req, res, next) => {
    let userId = req.params.userId;
    userService.getUserInterestService.getUserInterest(userId, res);
}

fetchAllUsersPublicData = (req, res, next) => {
    let userId = req.params.userId;
    userService.fetchAllUsersPublicDataService.fetchAllUsersPublicInfo(userId, res);
}

onUserLogout = (req, res, next) => {
    let userId = req.params.userId;
    userService.updateUSerLogoutService.updateUSerLogout(userId, res);
}

getUserLikesDislikes = (req, res, next) => {
    let userId = req.params.userId;
    userService.getUserLikesDislikesService.getAllUserLikesDislikes(userId, res);
}

updateUserLikesDislikes = (req, res, next) => {
    let checker = req.params.checker;
    userService.updateUserLikesDislikesService.putUserLikesDislikes(checker, req.body, res);
}

saveUserUnlikesController = (req, res, next) => {
    userService.updateUserLikesDislikesService.putUserUnlikes(req.body, res);
}

blockUserControl = (req, res, next) => {
    userService.blockUserService.blockThisUser(req.body, res);
}

visitUserControl = (req, res, next) => {
    userService.visitUserService.putVisitUser(req.body, res);
}

userNotifsController = (req, res, next) => {
    let userId = req.params.userId;

    userService.getUserNotifsService.getUserNotifs(userId, res);
}

reportUserController = (req, res, next) => {
    userService.reportThisUserService.putReportUser(req.body, res);
}

userChatController = (req, res, next) => {
    let userId = req.params.userId;

    userService.userChatService.userChatContact(userId, res);
}

saveUserChatController = (req, res, next) => {
    userService.saveUserChatService.saveUserChatContact(req.body, res);
}

getUserChatMsgController = (req, res, next) => {
    let userId = req.params.userId;
    let desUserId = req.params.desUserId;

    userService.getUserChatMsgsService.userChatMsgs(desUserId, userId, res);
}

module.exports = {
    getUserChatMsgController,
    saveUserChatController,
    userChatController,
    reportUserController,
    userNotifsController,
    visitUserControl,
    blockUserControl,
    updateUserLikesDislikes,
    getUserLikesDislikes,
    onUserLogout,
    fetchAllUsersPublicData,
    getUserInterests,
    editPrfile,
    getProfileInfo,
    getCurrentProfileInfo,
    restUserPassword,
    saveUserUnlikesController,
    activateUserAccount,
    registerUser,
    loginUser
}
