import axios from "axios/index";
import {
    GET_USER_LIKES,
} from '../ActionType';

function userLikes(token, userId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/likes/" + userId, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: GET_USER_LIKES,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: GET_USER_LIKES,
                payload: "",
            })
        });
}

export function GetuserLikes(userId) {
    const token = localStorage.getItem("token");

    return async function (dispatch) {
        await userLikes(token, userId, dispatch)
    }
};