const likeDao = require('../../database/LikeDao');
const dislikeDao = require('../../database/DislikeDao');

async function getAllUserLikesDislikes (userId, res) {
    let like = new likeDao(userId);
    let dislike  = new dislikeDao(userId);

    try {
        let countLikes = await like.countLikesByUserId();
        let countdislikes = await dislike.countDislikesByUserId();
        
        res.status(200).json({
            msg: "Fetch data with success",
            data: {
                likes: countLikes,
                dislikes: countdislikes
            },
            code: 200
        })
    } catch (err) {
        res.status(200).json({
            msg: "An error occured",
            code: 500
        })
    }

}

module.exports = {
    getAllUserLikesDislikes
}