import axios from "axios/index";
import {
    REPORT_USER,
} from '../ActionType';

function reportUser(token, reported_userId, reporter_userId, dispatch) {
    axios.post(process.env.REACT_APP_API_URL + "/users/report", {
        reported_userId: reported_userId,
        reporter_userId: reporter_userId
    }, {
        headers: {
            "Authorization": `Bearer ` + token
        }
    })
        .then(results => {
            dispatch({
                type: REPORT_USER,
                payload: results.data,
            })
            setTimeout(() => {
                dispatch({
                    type: REPORT_USER,
                    payload: "",
                })
            }, 20)
        })
        .catch(err => {
            dispatch({
                type: REPORT_USER,
                payload: false,
            })
        });
}

export function reportThisUser(reported_userId, checker) {
    const token = localStorage.getItem("token");
    const reporter_userId = localStorage.getItem("userId");
    

    return async function (dispatch) {
        await reportUser(token, reported_userId, reporter_userId, dispatch)
    }
};