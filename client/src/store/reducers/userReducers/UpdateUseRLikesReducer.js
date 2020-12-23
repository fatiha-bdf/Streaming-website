import {
    UPDATE_USER_LIKES,
  } from "../../actions/ActionType";
  
  const initialState = {
    updateUserLikes: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case UPDATE_USER_LIKES:
            return {
                updateUserLikes: action.payload,
            };

        default:
            return state;
    }
}