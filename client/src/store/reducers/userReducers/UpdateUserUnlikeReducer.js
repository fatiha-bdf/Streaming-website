import {
    UPDATE_USER_UNLIKES,
  } from "../../actions/ActionType";
  
  const initialState = {
    updateUserUnlikes: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case UPDATE_USER_UNLIKES:
            return {
                updateUserUnlikes: action.payload,
            };

        default:
            return state;
    }
}