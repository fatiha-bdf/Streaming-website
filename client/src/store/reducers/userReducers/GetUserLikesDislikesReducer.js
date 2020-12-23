import {
    GET_USER_LIKES,
  } from "../../actions/ActionType";
  
  const initialState = {
    getUserLikes: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_USER_LIKES:
            return {
                getUserLikes: action.payload,
            };

        default:
            return state;
    }
}