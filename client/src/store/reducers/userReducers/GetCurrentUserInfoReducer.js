import {
    GET_CURRENT_USER,
  } from "../../actions/ActionType";
  
  const initialState = {
    getCurrentProfileInfo: [],
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_CURRENT_USER:
            return {
                getCurrentProfileInfo: action.payload,
            };

        default:
            return state;
    }
}