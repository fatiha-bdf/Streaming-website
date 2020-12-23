import {
    RESET_PWD,
  } from "../../actions/ActionType";
  
  const initialState = {
    resetPwd: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case RESET_PWD:
            return {
                resetPwd: action.payload,
            };

        default:
            return state;
    }
}