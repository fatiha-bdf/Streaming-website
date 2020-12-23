import {
    BLOCK_USER,
  } from "../../actions/ActionType";
  
  const initialState = {
    blockUser: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case BLOCK_USER:
            return {
                blockUser: action.payload,
            };

        default:
            return state;
    }
}