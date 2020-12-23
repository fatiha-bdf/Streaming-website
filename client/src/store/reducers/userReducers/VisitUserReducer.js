import {
    VISIT_USER,
  } from "../../actions/ActionType";
  
  const initialState = {
    visitUser: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case VISIT_USER:
            return {
                visitUser: action.payload,
            };

        default:
            return state;
    }
}