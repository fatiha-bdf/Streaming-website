const db = require('../../config/dbConnection');

execQuery = (queryEntiity) => {
    return new Promise((resolve, reject) => {
        db.query(queryEntiity, function (error, result) {
            if (error) throw error;
            console.log('QUERY EXECUTED SUCCESSFULLY');
            resolve(result);
        });
    })
}

interestsSerializer = (tags) => {
    return new Promise((resolve, reject) => {
        let tagsData = [];
        if (Array.isArray(tags) && tags !== "") {
            tags.forEach(element => {
                tagsData.push({ value: element.name, label: element.name })
            });
            resolve(tagsData);
        } else
            resolve([]);
    })
}

// usersDaoSerializer = 

userDaoSerializer = (data) => {
    return Promise.resolve({
        id: data[0].id,
        pseudo: data[0].pseudo,
        lastname: data[0].lastname,
        firstname: data[0].firstname,
        email: data[0].email,
        age: data[0].age,
        bio: data[0].bio,
        gender: data[0].gender,
        sexual_orientation: data[0].sexual_orientation,
        psycho_type: data[0].psycho_type,
        localisation: data[0].localisation,
        profile_completion: data[0].profile_completion,
        suspended: data[0].suspended,
        fame: data[0].fame,
        online: data[0].online,
        updatedAt: data[0].updatedAt, 
        createdAt: data[0].createdAt
    })
}

module.exports = {
    interestsSerializer,
    execQuery,
    userDaoSerializer
}