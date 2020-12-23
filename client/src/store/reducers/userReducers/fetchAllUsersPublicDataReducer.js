import {
    FETCH_ALL_USERS_PUBLIC_DATA,
  } from "../../actions/ActionType";
  
  const initialState = {
    fetchAllUsersPublicData: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        
        case FETCH_ALL_USERS_PUBLIC_DATA:
            return {
                fetchAllUsersPublicData: action.payload,
            };

        default:
            return state;
    }
}