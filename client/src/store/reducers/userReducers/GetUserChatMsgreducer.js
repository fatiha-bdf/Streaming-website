import {
    GET_USER_CHAT_MSG,
  } from "../../actions/ActionType";
  
  const initialState = {
    getUserChatMsg: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_USER_CHAT_MSG:
            return {
                getUserChatMsg: action.payload,
            };

        default:
            return state;
    }
}