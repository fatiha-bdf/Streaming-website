
import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router-dom";
import { signupUser } from '../../../store/actions/UsersActions/signupUserAction';
import { ToastContainer } from 'react-toastify';
const customNotification = require('../utils/notification');

class Signup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstname: "",
            lastname: "",
            pseudonyme: "",
            password: "",
            email: "",
            confPassword: "",
            resgiterUser: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handlFormSubmit = this.handlFormSubmit.bind(this);
    }

    handlFormSubmit(e) {
        e.preventDefault();
        if (this.valdateFormData())
            this.props.onSignupUser(this.state);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    valdateFormData() {
        let validateEmail = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
        if (this.state.password !== this.state.confPassword) {
            customNotification.fireNotification("warning", "Passwords does not match")
            return false;
        } else if (this.state.password.length < 8) {
            customNotification.fireNotification("warning", "Password must contain at least 8 characters")
            return false;
        } else if (!validateEmail.test(this.state.email)) {
            customNotification.fireNotification("warning", "Email not valid")
            return false;
        }
        return true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.resgiterUser.msg !== "" && nextProps.resgiterUser.code === 204)
            customNotification.fireNotification("error", nextProps.resgiterUser.msg)
        if (nextProps.resgiterUser.msg !== "" && nextProps.resgiterUser.code === 200)
            customNotification.fireNotification("success", nextProps.resgiterUser.msg)
    }

    render() {
        return (
            <div className="login-box">
                <ToastContainer />
                <div className="login-logo">
                    <b>Matcha</b>
                </div>
                <div className="login-box-body">
                    <p className="login-box-msg">
                        <Link to="/login" onClick={this.props.navigateTo.bind(this, '/login')}>
                            <i className="fa fa-backward pull-left"></i>
                        </Link>Signup a new account</p>
                    <form onSubmit={this.handlFormSubmit} encType="multipart/form-data">
                        <div className="form-group has-feedback">
                            <input required type="text" className="form-control" onChange={this.handleChange} name="firstname" placeholder="firstname" />
                            <span className="glyphicon glyphicon-book form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input required type="text" className="form-control" onChange={this.handleChange} name="lastname" placeholder="Lastname" />
                            <span className="glyphicon glyphicon-book form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input required type="text" className="form-control" onChange={this.handleChange} name="pseudonyme" placeholder="Pseudonyme" />
                            <span className="glyphicon glyphicon-book form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input required type="email" className="form-control" onChange={this.handleChange} name="email" placeholder="Email" />
                            <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input required type="password" className="form-control" onChange={this.handleChange} name="password" placeholder="Password" />
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input required type="password" className="form-control" onChange={this.handleChange} name="confPassword" placeholder="Confirm your password" />
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div className="row">
                            <div className="col-xs-4 pull-right">
                                <button type="submit" className="btn btn-primary btn-block btn-flat">Register</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
};

const state = (state, ownProps = {}) => {
    
    return {
        location: state.location,
        resgiterUser: state.registerUser.registerUser
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateTo: (location) => {
            dispatch(push(location));
        },
        onSignupUser: (data) => dispatch(signupUser(data)),
    }
};

export default connect(state, mapDispatchToProps)(Signup);