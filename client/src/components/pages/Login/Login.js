
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { LoginUser } from "../../../store/actions/UsersActions/LoginUserAction";
import { ToastContainer } from 'react-toastify';
const customNotification = require('../utils/notification');


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      email: "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.handlFormSubmit = this.handlFormSubmit.bind(this);
  }

  handlFormSubmit(e) {
    e.preventDefault();
    this.props.onLoginUser(this.state)
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loginUser.msg !== "" && nextProps.loginUser.code === 204)
      customNotification.fireNotification("error", nextProps.loginUser.msg)
  }


  render() {
    return (
      <div className="login-box">
        <ToastContainer />
        <div className="login-logo">
          <b>Matcha</b>
        </div>
        <div className="login-box-body">
          <p className="login-box-msg">Sign in to start your session</p>

          <form onSubmit={this.handlFormSubmit} encType="multipart/form-data">
            <div className="form-group has-feedback">
              <input required type="text" className="form-control" name="email" onChange={this.handleChange} placeholder="Email or Username" />
              <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div className="form-group has-feedback">
              <input required type="password" className="form-control" name="password" onChange={this.handleChange} placeholder="Password" />
              <span className="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div className="row">
              <div className="col-xs-8">
                <div className="checkbox icheck">
                  <label>
                    {/* <input type="checkbox" /> Remember Me */}
                  </label>
                </div>
              </div>
              <div className="col-xs-4">
                <button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
              </div>
            </div>
          </form>


          <Link to="/resetpwd" onClick={this.props.navigateTo.bind(this, '/resetpwd')}>
            Forgot your password ?
          </Link><br></br>
          <Link to="/signup" onClick={this.props.navigateTo.bind(this, '/signup')}>
            Register a new membership
          </Link>
        </div>
      </div>
    );
  }
};

const state = (state, ownProps = {}) => {
  return {
    loginUser: state.loginUser.authenticated,
    location: state.location,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    navigateTo: (location) => {
      dispatch(push(location));
    },
    onLoginUser: (data) => dispatch(LoginUser(data))
  }
};

export default connect(state, mapDispatchToProps)(Login);