import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { UserLogout } from "../../../store/actions/UsersActions/UserLogoutAction";
import { createBrowserHistory } from "history";

class Logout extends React.Component {

    async UNSAFE_componentWillMount() {
        await this.props.onUserLogout();
        let history = createBrowserHistory();
        localStorage.setItem('token', "");
        localStorage.setItem('userId', "");
        history.push("/login");
        let pathUrl = window.location.href;
        window.location.href = pathUrl; 
    }

    render() {
        
        return (
            <div>
            </div>
        );
    }
}
const state = (state, ownProps = {}) => {
    return {
        location: state.location,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateTo: (location) => {
            dispatch(push(location));
        },
        onUserLogout: () => dispatch(UserLogout()),
    }
};

export default connect(
    state,
    mapDispatchToProps
)(Logout);