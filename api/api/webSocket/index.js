const UserDao = require('../database/UserDao');
const BlockDao = require("../database/BlockDao");

exports.connectWebSocket = (io) => {
    let notifs = {};
    let likesList = {};
    let user = new UserDao();

    io.on('connection', function (socket) {
        socket.on('join', (userId) => {
            notifs[userId] = new Array();
            likesList[userId] = new Array();
            socket.join(userId);
            console.log("socket joined!")
        });

        socket.on('likeUser', async function (data) {
            let userFullname = await user.getUserFullname(data.likerId);
            let block = new BlockDao(data.likedId)
            data.fullname = userFullname;

            if (await block.hasUserNotBeenBlocked(data.likerId, data.likedId)) {
                if (notifs[data.likedId] !== undefined) {
                    notifs[data.likedId].push(data);
                    io.to(data.likedId).emit('userNotifications', notifs[data.likedId]);
                }

                if (likesList[data.likedId] !== undefined) {
                    likesList[data.likedId].push(data);
                    io.to(data.likedId).emit('userLikesList', notifs[data.likedId]);
                }
            }

        })

        socket.on('new-msg', function (data) {
            io.to(data.room).emit('send-new-msg', data.msg);
        })

        socket.on('initNotification', function (userId) {
            if (notifs[userId] !== undefined) {
                notifs[userId] = [];
            }

            if (likesList[userId] !== undefined) {
                likesList[userId] = [];
            }
        })

        socket.on('initLikesList', function (userId) {
            if (likesList[userId] !== undefined) {
                likesList[userId] = [];
            }
        })

        socket.on('disconnect', function () {
            socket.disconnect(true)
            console.log("socket disconnected!")
        });

    });
}
