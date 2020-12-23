import axios from "axios/index";
import {
    SAVE_USER_CHAT,
} from '../ActionType';

function saveUserChat(token, data, dispatch) {
    axios.post(process.env.REACT_APP_API_URL + "/users/chat", data, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: SAVE_USER_CHAT,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: SAVE_USER_CHAT,
                payload: "",
            })
        });
}

export function saveUserChatAction(data) {
    const token = localStorage.getItem("token");

    return async function (dispatch) {
        await saveUserChat(token, data, dispatch)
    }
};