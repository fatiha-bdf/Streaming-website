import axios from "axios/index";
import {
    GET_USER,
} from '../ActionType';

function userProfileInfo(token, userId, sourceUserId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/" + userId + "/user/" + sourceUserId, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: GET_USER,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: GET_USER,
                payload: false,
            })
        });
}

export function GetUserInfo(userId) {
    const token = localStorage.getItem("token");
    const sourceUserId = localStorage.getItem("userId");

    return async function (dispatch) {
        await userProfileInfo(token, userId, sourceUserId, dispatch)
    }
};