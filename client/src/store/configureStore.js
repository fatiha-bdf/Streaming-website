import { combineReducers } from 'redux';
import { routerReducer } from "react-router-redux";
import registerUser from './reducers/userReducers/registerUserReducer';
import loginUser from './reducers/userReducers/LoginUserReducer';
import resetPwd from './reducers/userReducers/ResetPwdReducer';
import editProfile from './reducers/userReducers/EditUserReducer';
import getProfileInfo from './reducers/userReducers/GetUserInfoReducer';
import getUserInterests from './reducers/interestsReducer/getUserInterestsreducer';
import fetchAllUsersPublicData from './reducers/userReducers/fetchAllUsersPublicDataReducer';
import locateUser from './reducers/userReducers/LocatUserReducer';
import logoutUser from './reducers/userReducers/UserLogoutReducer';
import getCurrentProfileInfo from './reducers/userReducers/GetCurrentUserInfoReducer';
import getUserLikes from './reducers/userReducers/GetUserLikesDislikesReducer';
import updateUserLikes from './reducers/userReducers/UpdateUseRLikesReducer';
import blockUser from './reducers/userReducers/BlockUserReducer';
import visitUser from './reducers/userReducers/VisitUserReducer';
import getUserNotifs from './reducers/userReducers/GetUserNotifsReducer';
import reportUser from './reducers/userReducers/ReportUserReducer';
import getContactChat from './reducers/userReducers/GetUserChatContactReducer';
import saveUseRchat from './reducers/userReducers/SaveUserchatMsgReducer';
import getUserChatMsg from './reducers/userReducers/GetUserChatMsgreducer';
import updateUserUnlikes from './reducers/userReducers/UpdateUserUnlikeReducer';

const reducers = combineReducers({
  updateUserUnlikes: updateUserUnlikes,
  getUserChatMsg: getUserChatMsg,
  getContactChat: getContactChat,
  saveUseRchat: saveUseRchat,
  reportUser: reportUser,
  getUserNotifs: getUserNotifs,
  visitUser: visitUser,
  blockUser: blockUser,
  updateUserLikes: updateUserLikes,
  getUserLikes: getUserLikes,
  getCurrentProfileInfo: getCurrentProfileInfo,
  logoutUser: logoutUser,
  locateUser: locateUser,
  editProfile: editProfile,
  getUserInterests: getUserInterests,
  getProfileInfo: getProfileInfo,
  router: routerReducer,
  resetPwd: resetPwd,
  loginUser: loginUser,
  registerUser: registerUser,
  fetchAllUsersPublicData: fetchAllUsersPublicData
});

export default reducers;