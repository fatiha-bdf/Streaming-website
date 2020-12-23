import {
    GET_USER_INTRESTS,
  } from "../../actions/ActionType";
  
  const initialState = {
    getUserInterests: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_USER_INTRESTS:
            return {
                getUserInterests: action.payload,
            };

        default:
            return state;
    }
}