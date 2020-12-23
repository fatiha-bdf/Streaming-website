import {
    GET_USER_NOTIFS,
  } from "../../actions/ActionType";
  
  const initialState = {
    getUserNotifs: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_USER_NOTIFS:
            return {
                getUserNotifs: action.payload,
            };

        default:
            return state;
    }
}