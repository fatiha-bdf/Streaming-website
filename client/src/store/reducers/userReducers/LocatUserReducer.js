import {
    LOCATE_USER
  } from "../../actions/ActionType";
  
  const initialState = {
    locateUser: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case LOCATE_USER:
            return {
                locateUser: action.payload,
            };
        
        default:
            return state;
    }
}