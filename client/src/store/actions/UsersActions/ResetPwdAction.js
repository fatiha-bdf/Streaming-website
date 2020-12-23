import axios from "axios/index";
import {
    RESET_PWD,
} from '../ActionType';



export function ResetPwdUser(emailOrUsername) {

    return function (dispatch) {
        axios.put(process.env.REACT_APP_API_URL + "/users/resetpwd", {
            "emailOrUsername": emailOrUsername,
        }, { 'content-type': 'application/x-www-form-urlencoded' })
            .then(res => {
                dispatch({
                    type: RESET_PWD,
                    payload: res.data,
                });
                setTimeout(() => {
                    dispatch({
                        type: RESET_PWD,
                        payload: "",
                    })
                }, 10)
            })
            .catch(err => {
                dispatch({
                    type: RESET_PWD,
                    payload: false
                })
            });
    }

};