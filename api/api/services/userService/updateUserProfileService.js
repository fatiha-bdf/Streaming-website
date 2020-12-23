const UserDao = require('../../database/UserDao');
const TagsDao = require('../../database/TagsDao');
const PicturesDao = require('../../database/PictureDao');

async function updateUserProfile(data, files, userId, res) {
    let user = new UserDao();
    let tags = new TagsDao(userId);
    let pictures = new PicturesDao(userId);

    // Check if user exists
    if (await user.userExist(userId)) {
        // Update user interests
        if (Array.isArray(data.tags))
            tags.updateTags(data.tags, 'arr')
        else
            tags.updateTags(data.tags, 'str')
        // Update user pictures
        if (files.length > 0)
            await pictures.updatePictures(files, data.profilePhoto)
        // Update user information
        if (await user.updateUserProfile(data, userId) === true) {
            res.status(200).json({
                code: 200,
                msg: "Profile updated with success"
            })
        } else {
            res.status(200).json({
                code: 500,
                msg: "Sorry an Error occured !"
            })
        }
    } else {
        res.status(200).json({
            code: 204,
            msg: "This account does not exist !"
        })
    }


}

module.exports = {
    updateUserProfile
}