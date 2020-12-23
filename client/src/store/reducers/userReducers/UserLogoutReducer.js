import {
    LOGOUT_USER,
  } from "../../actions/ActionType";
  
  const initialState = {
    logoutUser: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case LOGOUT_USER:
            return {
                logoutUser: action.payload,
            };

        default:
            return state;
    }
}