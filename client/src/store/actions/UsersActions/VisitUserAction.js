import axios from "axios/index";
import {
    VISIT_USER,
} from '../ActionType';

function VisitUser(token, visited_userId, visiter_userId, dispatch) {
    axios.post(process.env.REACT_APP_API_URL + "/users/visit", {
        visited_userId: visited_userId,
        visiter_userId: visiter_userId
    }, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: VISIT_USER,
                payload: results.data,
            })
        })
        .catch(err => {
            dispatch({
                type: VISIT_USER,
                payload: false,
            })
        });
}

export function VisitThisUser(visited_userId, checker) {
    const token = localStorage.getItem("token");
    const visiter_userId = localStorage.getItem("userId");
    

    return async function (dispatch) {
        await VisitUser(token, visited_userId, visiter_userId, dispatch)
    }
};