import axios from "axios/index";
import {
    LOCATE_USER,
} from '../ActionType';

function locateUser(dispatch) {
    axios.get("http://ip-api.com/json")
        .then(response => {
            dispatch({
                type: LOCATE_USER,
                payload: response.data.lat + "," + response.data.lon,
            })
        })
        .catch(err => {
            dispatch({
                type: LOCATE_USER,
                payload: "",
            })
        });
}

export function getUserLocation() {
    return async function (dispatch) {
        await locateUser(dispatch)
    }
};