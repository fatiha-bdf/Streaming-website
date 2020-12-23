import axios from "axios/index";
import {
    UPDATE_USER_LIKES,
} from '../ActionType';

function updateUserLikes(checker, token, liked_userId, userId, dispatch) {
    axios.post(process.env.REACT_APP_API_URL + "/users/likes/" + checker, {
        liker_user_id: userId,
        has_been_liked_user_id: liked_userId
    }, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: UPDATE_USER_LIKES,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: UPDATE_USER_LIKES,
                payload: false,
            })
        });
}

export function PutUpdateUserLikes(liked_userId, checker) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    

    return async function (dispatch) {
        await updateUserLikes(checker, token, liked_userId, userId, dispatch)
    }
};