import {
    REPORT_USER,
} from "../../actions/ActionType";

const initialState = {
    reportUser: "",
};

export default function (state = initialState, action) {
    switch (action.type) {

        case REPORT_USER:
            return {
                reportUser: action.payload,
            };

        default:
            return state;
    }
}