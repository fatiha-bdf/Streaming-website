import axios from "axios/index";
import {
    BLOCK_USER,
} from '../ActionType';

function blockUser(token, blocked_userId, blocker_userId, dispatch) {
    axios.post(process.env.REACT_APP_API_URL + "/users/block", {
        blocked_userId: blocked_userId,
        blocker_userId: blocker_userId
    }, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: BLOCK_USER,
                payload: results.data,
            })
            setTimeout(() => {
                dispatch({
                    type: BLOCK_USER,
                    payload: "",
                })
            }, 20)
        })
        .catch(err => {
            dispatch({
                type: BLOCK_USER,
                payload: false,
            })
        });
}

export function BlockThisUser(blocked_userId, checker) {
    const token = localStorage.getItem("token");
    const blocker_userId = localStorage.getItem("userId");
    

    return async function (dispatch) {
        await blockUser(token, blocked_userId, blocker_userId, dispatch)
    }
};