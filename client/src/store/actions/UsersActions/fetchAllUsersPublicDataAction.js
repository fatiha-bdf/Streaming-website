import axios from "axios/index";

import {
    FETCH_ALL_USERS_PUBLIC_DATA
} from '../ActionType';

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

function CalculateDistance (userPos, userList){

    var distance_array = [];
    var userXY = userPos.split(',');
    var elementXY = [];
    var dist = 0;

    userList.forEach(element => {
        elementXY = element.localisation.split(',');
        dist = getDistanceFromLatLonInKm(userXY[0], userXY[1], elementXY[0], elementXY[1]);
        distance_array[element.id] = {
            id: element.id,
            dist: dist
        }
    });

    return(distance_array);
}

function filter_fame (userList, rangeFame) {
    var id_list = [];
    userList.forEach(element => {
        if (parseInt(element.fame) >= parseInt(rangeFame)) {
            id_list.push(element.id);
        }  
    });
    return (id_list)
} 

function filter_age (userList, age) {
    var id_list = [];
    userList.forEach(element => {
        if (parseInt(element.age) >= parseInt(age[0]) && parseInt(element.age) <= parseInt(age[1])) {
            id_list.push(element.id);
        }  
    });
    return (id_list)
}

function filter_tags (userList, tags) {
    var id_list = [];
    if (tags.length === 0){
        userList.forEach(element => {
            id_list.push(element.id);
        })
    } else {
        userList.forEach(element => {
            element.tags.forEach(tag => {
                tags.forEach(filter_tag => {
                    if (filter_tag === tag){
                        id_list.push(element.id);
                    }
                })
            })
        });
    }
    return (id_list)
}

function filter_dist (array, dist){
    var id_list = [];
    array.forEach(element => {
        if (element.dist <= dist){
            id_list.push(element.id);
        }
    });
    return(id_list);
}

function intersection() {
    var result = [];
    var lists;
  
    if(arguments.length === 1) {
      lists = arguments[0];
    } else {
      lists = arguments;
    }
  
    for(var i = 0; i < lists.length; i++) {
      var currentList = lists[i];
      for(var y = 0; y < currentList.length; y++) {
          var currentValue = currentList[y];
        if(result.indexOf(currentValue) === -1) {
          var existsInAll = true;
          for(var x = 0; x < lists.length; x++) {
            if(lists[x].indexOf(currentValue) === -1) {
              existsInAll = false;
              break;
            }
          }
          if(existsInAll) {
            result.push(currentValue);
          }
        }
      }
    }
    return result;
  }

async function applyFilteronUser(usersList, filter) {
    return new Promise((resolve, reject) => {
        // console.log("User list : ", usersList);
        // console.log("filter :", filter);
        var tag_array = [];
        if (filter[0].interests !== null){
            filter[0].interests.forEach(element => {
                tag_array.push(element.value);
            });
        }

        if (usersList.code === 200){
            var filteredUser = [];

            var IdsFilteredByFame = filter_fame(usersList.data, filter[0].rangeFame)
            var IdsFilteredByAge = filter_age(usersList.data, filter[0].age)
            var IdsFilteredByTags = filter_tags(usersList.data, tag_array)
            
            var UserDists = CalculateDistance(filter[0].userPos, usersList.data);

            var IdsFilteredByDist = filter_dist(UserDists, filter[0].rangeLocalisation)

            var IdsFiltered = intersection(IdsFilteredByFame, IdsFilteredByAge, IdsFilteredByTags, IdsFilteredByDist);

            usersList.data.forEach(element => {
                IdsFiltered.forEach(id => {
                    if (parseInt(element.id) === parseInt(id)) {
                        UserDists.forEach(dist => {
                            if (dist.id === element.id){
                                element.distance = dist.dist;
                            }
                        });
                        filteredUser.push(element);
                    }
                });
            });
            resolve(filteredUser);
        } else {
            resolve([]);
        }
    })
}

async function IdsFilteredBySexefunc(userList, wants){
    var id_list = [];
    // console.log(wants);
    if (wants === 'B'){
        userList.forEach(element => id_list.push(element.id));
    } else {
        userList.forEach(element => {
            if (element.gender === wants) {
                id_list.push(element.id);
            }  
        });
    }
    return (id_list)
}

async function IdsThatAreInA6000KmRadiusfunc(array, dist) {
    var id_list = [];
    array.forEach(element => {
        if (element.dist <= dist){
            id_list.push(element.id);
        }
    });
    return(id_list);
}

async function IdsTharAreInA30FameRadiusfunc(userList, rangeFame){
    var id_list = [];
    var minRange = parseInt(rangeFame) - 30;
    var maxRange = parseInt(rangeFame) + 30;
    userList.forEach(element => {
        if (parseInt(element.fame) > minRange && parseInt(element.fame) < maxRange) {
            id_list.push(element.id);
        }  
    });
    return (id_list)
}

async function applySuggestiononUsers(userList, filter){
    return new Promise(async (resolve, reject) => {
        if (userList.code === 200) {
            // console.log(userList.data);
            // console.log(filter);
            var filteredUser = [];

            let IdsFilteredBySexe = await IdsFilteredBySexefunc(userList.data, filter.wants);
            // console.log(IdsFilteredBySexe);

            var UserDists = CalculateDistance(filter.location, userList.data);
            // console.log(UserDists);

            let IdsThatAreInA6000KmRadius = await IdsThatAreInA6000KmRadiusfunc(UserDists, 10000);
            // console.log(IdsThatAreInA6000KmRadius);
            let IdsThatHaveAtLeast1TaginCommon = filter_tags(userList.data, filter.tags);
            // console.log(IdsThatHaveAtLeast1TaginCommon);
            let IdsTharAreInA30FameRadius = await IdsTharAreInA30FameRadiusfunc(userList.data, filter.fame);
            // console.log(IdsTharAreInA30FameRadius);

            var IdsFiltered = intersection(IdsFilteredBySexe, IdsThatAreInA6000KmRadius, IdsThatHaveAtLeast1TaginCommon, IdsTharAreInA30FameRadius);
            // console.log('result', IdsFiltered);
            
            userList.data.forEach(element => {
                IdsFiltered.forEach(id => {
                    if (parseInt(element.id) === parseInt(id)) {
                        UserDists.forEach(dist => {
                            if (dist.id === element.id){
                                element.distance = dist.dist;
                            }
                        });
                        filteredUser.push(element);
                    }
                });
            });
            resolve(filteredUser)
        } else {
            resolve([]);
        }
    })
}

async function AddDistance(userList) {
    return new Promise(async (resolve, reject) => {
        if (userList.code === 200) {
            var UserDists = CalculateDistance('48.8543,2.3527', userList.data);

            userList.data.forEach(element => {
                UserDists.forEach(dist => {
                    if(dist.id === element.id) {
                        element.distance = dist.dist;
                    }
                });
            })
            resolve(userList.data);
        } else {
            resolve([]);
        }
    })
}

async function UsersPublicData(filter, token, userId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/publicData/" + userId, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(async results => {
            if (filter.length === 0)
                dispatch({
                    type: FETCH_ALL_USERS_PUBLIC_DATA,
                    payload: {
                        data: await AddDistance(results.data),
                        code: 200
                    }
                })
            else {
                if (filter.hasOwnProperty('Suggestion') ){
                    dispatch({
                        type: FETCH_ALL_USERS_PUBLIC_DATA,
                        payload: {
                            data: await applySuggestiononUsers(results.data, filter),
                            code: 200
                        }
                    })
                } else {
                    dispatch({
                        type: FETCH_ALL_USERS_PUBLIC_DATA,
                        payload: {
                            data: await applyFilteronUser(results.data, filter),
                            code: 200
                        }
                    })
                }
            }

        })
        .catch(err => {
            dispatch({
                type: FETCH_ALL_USERS_PUBLIC_DATA,
                payload: false
            })
        })
}

export function fetchAllUsersPublicData(filter) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    return async function (dispatch) {
        await UsersPublicData(filter, token, userId, dispatch);
    }
}