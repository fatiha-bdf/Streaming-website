import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { GetCurrentUserInfo } from '../../store/actions/UsersActions/FetchCurrentUserInfoAction';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      profilePhoto: "",
    }
  }

  async UNSAFE_componentWillMount() {
    const userId = localStorage.getItem("userId");
    await this.props.onGetCurrentUserInfo(userId);
  }

  getProfilePicture(pictures, state) {
    let pics = [];
    let i = 0;
    while (i < pictures.length) {
      if (pictures[i].state === state)
        pics.push(pictures[i].path)
      i++;
    }

    return pics;
  }

  initProfileInformation(data) {
    let userInfo = data.info;
    let profilePhoto = this.getProfilePicture(data.pictures, 1);

    this.setState({
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      profilePhoto: profilePhoto.length > 0 ? profilePhoto : "",
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.getCurrentProfileInfo.data)
      this.initProfileInformation(nextProps.getCurrentProfileInfo.data);
  }

  render() {
    let image = "https://mgdetective.ma/wp-content/uploads/2018/05/profile.png"

    return (
      <header className="main-header">
        <a href="/" className="logo">
          <span className="logo-mini"><b>LME</b></span>
          <span className="logo-lg"><b>Match</b>Me</span>
        </a>
        <nav className="navbar navbar-static-top">
          <a href="/" className="sidebar-toggle" data-toggle="push-menu" role="button">
            <span className="sr-only">Toggle navigation</span>
          </a>

          <div className="navbar-custom-menu" style={{ zIndex: "1223" }}>
            <ul className="nav navbar-nav">
              {/* <li className="dropdown notifications-menu">
                <a href="/" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="fa fa-bell-o"></i>
                  <span className="label label-warning">10</span>
                </a>
                <ul className="dropdown-menu">
                  <li className="header">You have 10 notifications</li>
                  <li>
                    <ul className="menu">
                      <li>
                        <a href="/">
                          <i className="fa fa-users text-aqua"></i> 5 new members joined today
                            </a>
                      </li>
                      <li>
                        <a href="/">
                          <i className="fa fa-warning text-yellow"></i> Very long description here that may not fit into the
                          page and may cause design problems
                            </a>
                      </li>
                      <li>
                        <a href="/">
                          <i className="fa fa-users text-red"></i> 5 new members joined
                            </a>
                      </li>
                      <li>
                        <a href="/">
                          <i className="fa fa-shopping-cart text-green"></i> 25 sales made
                            </a>
                      </li>
                      <li>
                        <a href="/">
                          <i className="fa fa-user text-red"></i> You changed your username
                            </a>
                      </li>
                    </ul>
                  </li>
                  <li className="footer"><a href="/Notifications">View all</a></li>
                </ul>
              </li> */}

              <li className="dropdown user user-menu">
                <a href="/" className="dropdown-toggle" data-toggle="dropdown">
                  <img src={this.state.profilePhoto !== "" && this.state.profilePhoto.toString().substring(0, 5) === 'https' ?
                    this.state.profilePhoto
                    : this.state.profilePhoto === "" ? image : 
                    process.env.REACT_APP_API_URL + "/" + this.state.profilePhoto}
                    className="user-image" alt="User Image5" />
                  <span className="hidden-xs">{this.state.firstname} {this.state.lastname}</span>
                </a>
                <ul className="dropdown-menu">
                  <li className="user-header">
                    <img src={this.state.profilePhoto !== ""  && this.state.profilePhoto.toString().substring(0, 5) === 'https' ?
                      this.state.profilePhoto
                      : this.state.profilePhoto === "" ? image : process.env.REACT_APP_API_URL + "/" + this.state.profilePhoto}
                      className="img-circle" alt="User Image7" />

                    <p>
                      {this.state.firstname} {this.state.lastname}
                      {/* <small>Membre depuis 2019</small> */}
                    </p>
                  </li>
                  <li className="user-body">
                    <div className="row">
                    </div>
                  </li>
                  <li className="user-footer">
                    <div className="pull-left">
                      <Link to="/profile" onClick={this.props.navigateTo.bind(this, '/profile')} className="btn btn-default btn-flat">Profile</Link></div>
                    <div className="pull-right">
                      <Link to="/logout" onClick={this.props.navigateTo.bind(this, '/logout')} className="btn btn-default btn-flat">Deconnexion</Link>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}


const state = (state, ownProps = {}) => {
  return {
    getCurrentProfileInfo: state.getCurrentProfileInfo.getCurrentProfileInfo,
    location: state.location,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    navigateTo: (location) => {
      dispatch(push(location));
    },
    onGetCurrentUserInfo: (userId) => dispatch(GetCurrentUserInfo(userId)),
  }
};

export default connect(state, mapDispatchToProps)(Header);