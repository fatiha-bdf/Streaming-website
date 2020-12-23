const registerUser = require('./registerUserService');
const activateAccount = require('./activateAccountService')
const loginUser = require('./loginUserService');
const resetPassword = require('./resetPasswordService');
const updateUserProfile = require('./updateUserProfileService');
const getUserInfoService = require('./getUserInfoService');
const getUserInterestService = require('./getUserInterestService')
const fetchAllUsersPublicDataService = require('./fetchAllUsersPublicDataService');
const updateUSerLogoutService = require('./updateUSerLogoutService');
const getUserLikesDislikesService = require('./getUserLikesDislikesService');
const updateUserLikesDislikesService = require('./updateUserLikesDislikesService');
const blockUserService = require('./blockUserService');
const visitUserService = require('./visitUserService');
const getUserNotifsService = require('./getUserNotifsService')
const reportThisUserService = require('./reportThisUserService');
const userChatService = require('./userChatService');
const saveUserChatService = require('./saveUserChatService');
const getUserChatMsgsService = require('./getUserChatMsgsService');

module.exports = {
    getUserChatMsgsService,
    saveUserChatService,
    userChatService,
    getUserNotifsService,
    reportThisUserService,
    visitUserService,
    blockUserService,
    updateUserLikesDislikesService,
    getUserLikesDislikesService,
    updateUSerLogoutService,
    fetchAllUsersPublicDataService,
    getUserInterestService,
    registerUser,
    getUserInfoService,
    loginUser,
    updateUserProfile,
    resetPassword,
    activateAccount
}