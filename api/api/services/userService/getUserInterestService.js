const TagsDao = require('../../database/TagsDao');
const UtilsDao = require('../../database/utilsDao');

async function getUserInterest(userId, res) {
    try {
        let interests = new TagsDao();
        let allTags = await UtilsDao.interestsSerializer(await interests.getAllTags());
        res.status(200).json({
            msg: "All interests fetched",
            code: 200,
            data: allTags,
        }) 
    } catch(err) {
        res.status(200).json({
            msg: "All interests fetched",
            code: 500,
            data: err,
        })   
    }

}


module.exports = {
    getUserInterest
}