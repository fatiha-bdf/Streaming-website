import {
    EDIT_USER,
  } from "../../actions/ActionType";
  
  const initialState = {
    profileEdited: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case EDIT_USER:
            return {
                profileEdited: action.payload,
            };

        default:
            return state;
    }
}