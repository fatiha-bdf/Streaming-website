import axios from "axios/index";
import {
    GET_CONTACT_CHAT,
} from '../ActionType';

function userChatContact(token, userId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/chat/" + userId, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: GET_CONTACT_CHAT,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: GET_CONTACT_CHAT,
                payload: "",
            })
        });
}

export function GetuserChatContact() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    return async function (dispatch) {
        await userChatContact(token, userId, dispatch)
    }
};