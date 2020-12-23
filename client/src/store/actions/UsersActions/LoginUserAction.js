import axios from "axios/index";
import {
    AUTH_USER,
} from '../ActionType';
import { createBrowserHistory } from "history";



export function LoginUser(userInfo) {

    return function (dispatch) {
        axios.post(process.env.REACT_APP_API_URL + "/users/login", {
            "credentials": {
                "email": userInfo.email,
                "password": userInfo.password
            },
        }, { 'content-type': 'application/x-www-form-urlencoded' })
            .then(res => {
                if (res.data.code === 200) {
                    let history = createBrowserHistory();
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userId', res.data.userId);
                    history.push("/");
                    let urlPath = window.location.href;
                    window.location.href = urlPath;
                } else {
                    dispatch({
                        type: AUTH_USER,
                        payload: res.data,
                    });
                    setTimeout(() => {
                        dispatch({
                            type: AUTH_USER,
                            payload: "",
                        })
                    }, 10)
                }
            })
            .catch(err => {
                dispatch({
                    type: AUTH_USER,
                    payload: ""
                })
            });
    }

};