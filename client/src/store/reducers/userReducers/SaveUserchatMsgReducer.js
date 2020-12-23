import {
    SAVE_USER_CHAT,
} from "../../actions/ActionType";

const initialState = {
    saveUseRchat: "",
};

export default function (state = initialState, action) {
    switch (action.type) {

        case SAVE_USER_CHAT:
            return {
                saveUseRchat: action.payload,
            };

        default:
            return state;
    }
}