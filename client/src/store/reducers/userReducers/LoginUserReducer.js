import {
    AUTH_USER,
  } from "../../actions/ActionType";
  
  const initialState = {
    authenticated: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case AUTH_USER:
            return {
                authenticated: action.payload,
            };

        default:
            return state;
    }
}