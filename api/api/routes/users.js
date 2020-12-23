/**
 * Declared dependencies
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const authCkeck = require('../middleware/check-auth');
const userController = require('../controllers/userController');
var ExpressBrute = require('express-brute');

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

//=> End of declared dependencies

/**
 * Multer filter the uplaod file via [POST] and/or [GET] request
 */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        // Rename the uplaoded file
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Define the extension of the file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb(null, false);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


/*
 * API [POST] for roure /users/login 
 */
//TODO bruteforce.prevent
router.post('/login', userController.loginUser);

/*
 * API [POST] for roure /users/register 
 */
router.post('/register', userController.registerUser);

/*
 * API [GET] for roure /users/validateaccount/:token
 */
router.get('/validateaccount/:token', userController.activateUserAccount);

/*
 * API [PUT] for roure /users/resetpwd
 */
router.put('/resetpwd', userController.restUserPassword);

/*
 * API [PUT] for roure /users/:userId
 */
router.put('/:userId', authCkeck, upload.any(), userController.editPrfile);

/*
 * API [GET] for roure /users/:userId/user/:sourceUserId
 */
router.get('/:userId/user/:sourceUserId', authCkeck, upload.any(), userController.getProfileInfo);

/*
 * API [GET] for roure /users/interests/:userId
 */
router.get('/interests/:userId', authCkeck, userController.getUserInterests);

/*
 * API [GET] for roure /users/publicData/:userId
 */
router.get('/publicData/:userId', userController.fetchAllUsersPublicData);

/*
 * API [GET] for roure /users/logout/:userId
 */
router.get('/logout/:userId', userController.onUserLogout);

/*
 * API [GET] for roure /users/current/:userId
 */
router.get('/current/:userId', authCkeck, userController.getCurrentProfileInfo);

/*
 * API [GET] for roure /users/likes/:userId
 */
router.get('/likes/:userId', authCkeck, userController.getUserLikesDislikes);


/*
 * API [POST] for roure /users/likes/:checker
 */
router.post('/likes/:checker', authCkeck, userController.updateUserLikesDislikes);

/*
 * API [POST] for roure /users/block
 */
router.post('/block', authCkeck, userController.blockUserControl);

/*
 * API [POST] for roure /users/visit
 */
router.post('/visit', authCkeck, userController.visitUserControl);

/*
 * API [GET] for roure /users/notifs/:userId
 */
router.get('/notifs/:userId', authCkeck, userController.userNotifsController);

/*
 * API [POST] for roure /users/report
 */
router.post('/report', authCkeck, userController.reportUserController);

/*
 * API [GET] for roure /users/chat/:userId
 */
router.get('/chat/:userId', authCkeck, userController.userChatController);

/*
 * API [POST] for roure /users/chat
 */
router.post('/chat', authCkeck, userController.saveUserChatController);

/*
 * API [GET] for roure /users/chat/messages/:userId
 */
router.get('/chat/messages/:userId/:desUserId', authCkeck, userController.getUserChatMsgController);

/*
 * API [POST] for roure /users/unlikes
 */
router.post('/unlikes', authCkeck, userController.saveUserUnlikesController);

module.exports = router;