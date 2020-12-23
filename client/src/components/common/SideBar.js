
import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { GetCurrentUserInfo } from '../../store/actions/UsersActions/FetchCurrentUserInfoAction';
import io from 'socket.io-client';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      socket: io(process.env.REACT_APP_API_URL),
      lastname: "",
      profilePhoto: "",
      notifCount: 0,
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


  componentDidMount() {
    let room = localStorage.getItem("userId");
    this.state.socket.connect(true);
    this.state.socket.emit('join', room);
    this.state.socket.on('userNotifications', (data) => {
      this.setState({
        notifCount: data.length
      })
    })
  }

  componentWillUnmount() {
    this.state.socket.disconnect(true);
  }

  render() {
    let image = "https://mgdetective.ma/wp-content/uploads/2018/05/profile.png"

    return (
      <div>
        <aside className="main-sidebar" style={{ height: "1200px" }}>
          <section className="sidebar">
            <div className="user-panel">
              <div className="pull-left image">
                <img src={this.state.profilePhoto !== "" && this.state.profilePhoto.toString().substring(0, 5) === 'https' ?
                    this.state.profilePhoto
                    : this.state.profilePhoto === "" ? image : 
                    process.env.REACT_APP_API_URL + "/" + this.state.profilePhoto} className="img-circle" alt="User Imag1" />
              </div>
              <div className="pull-left info">
                <p>{this.state.firstname} {this.state.lastname}</p>
                <a href="/"><i className="fa fa-circle text-success"></i> Online</a>
              </div>
            </div>
            <form action="#" method="get" className="sidebar-form">
              <div className="input-group">
                <input type="text" name="q" className="form-control" placeholder="Search..." />
                <span className="input-group-btn">
                  <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i>
                  </button>
                </span>
              </div>
            </form>
            <ul className="sidebar-menu" data-widget="tree">
              <li className="header">NAVIGATION PRINCIPALE</li>
              <li className="active treeview">
                <Link to="/" onClick={this.props.navigateTo.bind(this, '/')}>
                  <i className="fa fa-dashboard"></i> <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={this.props.navigateTo.bind(this, '/profile')}>
                  <i className="fa fa-files-o"></i>
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/chat" onClick={this.props.navigateTo.bind(this, '/chat')}>
                  <i className="fa fa-th"></i> <span>Chat</span>
                  <span className="pull-right-container">
                    {/* <small className="label pull-right bg-green">4</small> */}
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/Notifications" onClick={this.props.navigateTo.bind(this, '/Notifications')}>
                  <i className="fa fa-bell"></i> <span>Notifications</span>
                  <span className="pull-right-container">
                  {this.state.notifCount !== 0 ?
                    <small className="label pull-right bg-green">
                      {this.state.notifCount}
                    </small>: ""}
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/Suggestion" onClick={this.props.navigateTo.bind(this, '/Suggestion')}>
                
                  <i className="fa fa-heart"></i> <span>Suggestion</span>
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
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

export default connect(state, mapDispatchToProps)(Sidebar);