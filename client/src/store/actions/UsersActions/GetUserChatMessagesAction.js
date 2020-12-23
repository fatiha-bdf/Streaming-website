import axios from "axios/index";
import {
    GET_USER_CHAT_MSG,
} from '../ActionType';

function userChatMsg(token, userId, dest_userId, dispatch) {
    axios.get(process.env.REACT_APP_API_URL + "/users/chat/messages/" + userId + "/" + dest_userId, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: GET_USER_CHAT_MSG,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: GET_USER_CHAT_MSG,
                payload: "",
            })
        });
}

export function GetuserChatMsg(dest_userId) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    return async function (dispatch) {
        await userChatMsg(token, userId, dest_userId, dispatch)
    }
};