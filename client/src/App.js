import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/pages/Dashboard/Home";
import Login from "./components/pages/Login/Login";
import Logout from './components/pages/Logout/Logout';
import decode from 'jwt-decode';
import NotFound from './components/pages/NotFound/NotFound';
import Signup from './components/pages/Signup/Signup';
import Profile from './components/pages/Profile/Profile';
import ResetPwd from './components/pages/ResetPwd/ResetPwd';
import Chat from './components/pages/Chat/chat';
import ProfileDetail from './components/pages/ProfileDetail/ProfileDetail';
import Notifications from './components/pages/Notifications/NotificationsHome.js';
import Suggestion from './components/pages/Suggestion/Suggestion';
import 'rc-slider/assets/index.css';

require('dotenv').config();

function App() {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      // { exp: 12903819203 }
      const { exp } = decode(token);

      if (exp < new Date().getTime() / 1000) {
        return false;
      }

    } catch (e) {
      return false;
    }

    return true;
  }

  const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
      checkAuth() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{ pathname: '/login' }} />
        )
    )} />
  )

  

  return (
    <div className="row">
      <Router>
        <Switch>
          <AuthRoute exact path="/Notifications" component={Notifications} />
          <AuthRoute exact path="/profiledetail/:id" component={ProfileDetail} />
          <AuthRoute exact path="/profile" component={Profile} />
          <AuthRoute exact path="/chat" component={Chat} />
          <AuthRoute exact path="/chat/" component={Chat} />
          <Route exact path="/resetpwd" component={ResetPwd} />
          <AuthRoute exact path="/" component={Home} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <AuthRoute exact path="/logout" component={Logout} />
          <AuthRoute exact path="/Suggestion" component={Suggestion} />
          <AuthRoute exact component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
