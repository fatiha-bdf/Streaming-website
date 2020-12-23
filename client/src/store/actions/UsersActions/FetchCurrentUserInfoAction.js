import axios from "axios/index";
import {
    GET_CURRENT_USER,
} from '../ActionType';

function userCurrentProfileInfo(token, userId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/current/" + userId, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: GET_CURRENT_USER,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: GET_CURRENT_USER,
                payload: false,
            })
        });
}

export function GetCurrentUserInfo(userId) {
    const token = localStorage.getItem("token");

    return async function (dispatch) {
        await userCurrentProfileInfo(token, userId, dispatch)
    }
};