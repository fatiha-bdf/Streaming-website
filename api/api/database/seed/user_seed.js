var fs = require('fs');
const hashPwd = require('../../utils/hashPwd');
var faker = require('faker');

async function seed(db) {

    db.query('select count(*) from user ', async function (error, result, fields) {
        if (error) throw error;

        //Check if there are already users in table and logs the count
        console.log(`user count : ${result[0]['count(*)']}`);
        if (result[0]['count(*)'] == 0) {

            var psycho_types = JSON.parse(fs.readFileSync('/usr/src/app/api/database/seed/psycho_types.json'));
            var tags_json = JSON.parse(fs.readFileSync('/usr/src/app/api/database/seed/tags.json'));

            //ADD ALL TAGS
            tags_json.forEach(tag_name => {
                query = `INSERT INTO \`interests\` ( \`name\`) VALUES ('${tag_name}')`;
                db.query(query, function (error, result) {
                    if (error) throw error;
                });
            });

            //takes on pyscho type randomly from all psycho types
            function generatePsychoType() {
                let per = Math.floor(Math.random() * Math.floor(16));
                return psycho_types[per];
            }

            //homosexual 20%, bisexual 10%, heterosexual 70%
            function generateSexualOrientation(gender) {
                let per = Math.floor(Math.random() * Math.floor(100));
                if (per < 20) {
                    //same sex
                    return (gender === 'F' ? 'F' : 'M');
                } else if (per >= 20 && per < 30) {
                    //both sex
                    return 'B';
                } else {
                    //other sex
                    return (gender === 'M' ? 'F' : 'M');
                }
            }

            for (let i = 0; i < 600; i++) {
                var firstName = faker.name.firstName();
                var lastname = faker.name.findName();
                var pseudo = firstName + ' ' + lastname;
                // var password = await hashPwd.hashPassword(faker.lorem.words(3).replace(/\s/g, ""));
                var password = await hashPwd.hashPassword("admin");
                var email = faker.internet.email(firstName);
                var age = Math.floor(Math.random() * Math.floor(82)) + 18;
                var num = Math.floor(Math.random() * Math.floor(15)) + 8;
                var bio = faker.lorem.words(num);
                var gender = (Math.floor(Math.random() * 2) % 2 === 1) ? 'M' : 'F';
                var sexual_orientation = generateSexualOrientation(gender);
                var psycho_type = generatePsychoType();
                faker.seed(i)
                var long = faker.address.longitude();
                faker.seed(i)
                var lat = faker.address.latitude();
                var localisation = `${long}, ${lat}`;
                var profile_completion = 8;
                var picture = faker.image.avatar();
                var fame = Math.floor(Math.random() * Math.floor(100)) + 1;

                var user = {
                    pseudo: pseudo,
                    firstName: firstName,
                    lastname: lastname,
                    password: password,
                    email: email,
                    age: age,
                    bio: bio,
                    gender: gender,
                    sexual_orientation: sexual_orientation,
                    psycho_type: psycho_type,
                    localisation: localisation,
                    profile_completion: profile_completion,
                    picture: picture,
                    fame: fame
                }

                //generate insert query !! ALWAYS THE SAME BIO for every users
                query = `INSERT INTO user (fame, pseudo, lastname, firstname, password, email, age, bio, gender, sexual_orientation, psycho_type, localisation, profile_completion, validated) \
                VALUES (${fame}, "${pseudo}", "${lastname}", "${firstName}", '${password}', '${email}', ${age}, '${bio}', '${gender}', '${sexual_orientation}', '${psycho_type}', '${localisation}', 11, 1)`;
                db.query(query, function (error, result) {
                    if (error) throw error;
                    ((i % 50 === 0) || i === 499) && console.log(`user ${i === 499 ? 500 : i} created`);
                });

                //ADD PROFILE PICTURE
                user_id = i + 1;
                query = `INSERT INTO picture (path, state, user_id) VALUES ('${picture}', 1, '${user_id}')`;
                db.query(query, function (error, result) {
                    if (error) throw error;
                });

                //ADD BETWEEN 10 tags to each users
                var id_tag = 1;
                for (var j = 0; j < Math.floor(Math.random() * 2) + 1; j++){
                    if (j === 0) 
                        id_tag = Math.floor(Math.random() * 10) + 1;
                    else {
                        id_tag = id_tag + Math.floor(Math.random() * 30) + 1;
                    }
                    // if (j === 0) {
                    //     id_tag = Math.floor(Math.random() * 361) + 1;
                    // } else {
                    //     if (id_tag > 310){
                    //         id_tag = Math.floor(Math.random() * 100) + 100;
                    //     } else if (id_tag < 50){
                    //         id_tag = Math.floor(Math.random() * 100) + 200;
                    //     } else {
                    //         id_tag += 50;
                    //     }
                    // }

                    query = `INSERT INTO user_has_interests (user_id, interests_id) VALUES ('${user_id}', '${id_tag}')`;
                    // console.log(query, id_tag, user_id);
                    db.query(query, function (error, result) {
                        if (error) throw error;
                    });
                }
                
            }
        }
    });
}

module.exports = seed;