import axios from "axios/index";
import {
    GET_USER_INTRESTS,
} from '../ActionType';

function userInterests(token, userId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/interests/" + userId, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: GET_USER_INTRESTS,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: GET_USER_INTRESTS,
                payload: false,
            })
        });
}

export function GetUserIntrests(userId) {
    const token = localStorage.getItem("token");

    return async function (dispatch) {
        await userInterests(token, userId, dispatch)
    }
};