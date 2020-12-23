import axios from "axios/index";
import {
    GET_USER_NOTIFS,
} from '../ActionType';

function userNotifes(token, userId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/notifs/" + userId, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: GET_USER_NOTIFS,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: GET_USER_NOTIFS,
                payload: "",
            })
        });
}

export function GetuserNotifes() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    return async function (dispatch) {
        await userNotifes(token, userId, dispatch)
    }
};