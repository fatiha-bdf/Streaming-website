import axios from "axios/index";
import {
    UPDATE_USER_UNLIKES,
} from '../ActionType';

function updateUserUnlikes(token, unliked_userId, userId, dispatch) {
    axios.post(process.env.REACT_APP_API_URL + "/users/unlikes", {
        unliker_user_id: userId,
        has_been_unliked_user_id: unliked_userId
    }, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: UPDATE_USER_UNLIKES,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: UPDATE_USER_UNLIKES,
                payload: false,
            })
        });
}

export function PutUpdateUserUnlikes(unliked_userId) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    

    return async function (dispatch) {
        await updateUserUnlikes(token, unliked_userId, userId, dispatch)
    }
};