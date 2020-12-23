import axios from "axios/index";
import {
    REGISTER_USER,
} from '../ActionType';

function registerUser(data, dispatch) {
    axios.post(process.env.REACT_APP_API_URL + "/users/register", data)
        .then(results => {
            dispatch({
                type: REGISTER_USER,
                payload: results.data,
            })
            setTimeout(() => {
                dispatch({
                    type: REGISTER_USER,
                    payload: "",
                })
            }, 10);
        })
        .catch(err => {
            dispatch({
                type: REGISTER_USER,
                payload: false,
            })
        });
}

export function signupUser(data) {
    return async function (dispatch) {
        await registerUser(data, dispatch)
    }
};