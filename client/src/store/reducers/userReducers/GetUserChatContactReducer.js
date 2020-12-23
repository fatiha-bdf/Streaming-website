import {
    GET_CONTACT_CHAT,
  } from "../../actions/ActionType";
  
  const initialState = {
    getContactChat: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_CONTACT_CHAT:
            return {
                getContactChat: action.payload,
            };

        default:
            return state;
    }
}