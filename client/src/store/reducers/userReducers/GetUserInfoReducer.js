import {
    GET_USER,
  } from "../../actions/ActionType";
  
  const initialState = {
    getProfileInfo: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_USER:
            return {
                getProfileInfo: action.payload,
            };

        default:
            return state;
    }
}