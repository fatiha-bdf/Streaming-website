import axios from "axios/index";
import {
    LOGOUT_USER,
} from '../ActionType';

function onUserLogout(token, userId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/logout/" + userId, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: LOGOUT_USER,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: LOGOUT_USER,
                payload: false,
            })
        });
}

export function UserLogout() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    return async function (dispatch) {
        await onUserLogout(token, userId, dispatch)
    }
};