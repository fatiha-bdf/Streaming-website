import React from "react";
import Header from "../../common/Header";
import Sidebar from "../../common/SideBar";
import Footer from "../../common/Footer";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Select from 'react-select';
import { ToastContainer } from 'react-toastify';
import { editThisUser } from '../../../store/actions/UsersActions/EditUserAction';
import { GetUserInfo } from '../../../store/actions/UsersActions/FetchUserInfoAction';
import { GetUserIntrests } from '../../../store/actions/intrestsActions/GetAllInterestsAction';
import { getUserLocation } from '../../../store/actions/UsersActions/GetUserLocationAction';
import { GetCurrentUserInfo } from '../../../store/actions/UsersActions/FetchCurrentUserInfoAction';
const customNotification = require('../utils/notification');

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      singleHObbi: "",
      psudonym: "",
      lastname: "",
      showAddHobi: false,
      profilePhoto: "",
      email: "",
      oldMultiPhotos: [],
      oldProfilePhoto: "",
      age: "",
      multiPhotos: [],
      Password: "",
      interestsArray: [],
      SexualOrientation: "",
      ProfileCompletion: "",
      gender: "",
      location: "",
      Fame: "",
      Bibliography: "",
      selectedOption: [],
    };

    this.handlePhotoesChange = this.handlePhotoesChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addHobytag = this.addHobytag.bind(this);
    this.handlFormSubmitAction = this.handlFormSubmitAction.bind(this);
    this.handleShowAddHoby = this.handleShowAddHoby.bind(this);
  }

  validateData() {
    let regLocation = new RegExp(/^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/)

    if (this.state.multiPhotos.length > 4) {
      customNotification.fireNotification("warning", "You cn not upload more than 4 pictures")
      return false;
    } else if (18 > parseInt(this.state.age) > 120) {
      customNotification.fireNotification("warning", "You don't have the legal age to date, this incident will be repported")
      return false;
    } else if (this.state.Password !== "" && this.state.Password.length < 8) {
      customNotification.fireNotification("warning", "Password must contain at least 8 characters.")
      return false;
    } else if (this.state.location !== "" && !regLocation.test(this.state.location)) {
      customNotification.fireNotification("warning", "Locaiton must valid.")
      return false;
    } else
      return true;
  }

  async UNSAFE_componentWillMount() {
    const userId = localStorage.getItem("userId");
    await this.props.onGetUserLocation();
    await this.props.onGetUserInfo(userId);
    await this.props.onGetUserIntrests(userId);
  }

  componentDidMount() {
    let locUser = this.props.locateUser;
    if (locUser !== undefined)
      this.setState({
        location: locUser
      })
  }

  async handlFormSubmitAction(e) {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (this.validateData()) {
      await this.props.onEditThisUser(this.state);
      setTimeout(async () => {
        await this.props.onGetUserInfo(userId);
        await this.props.onGetCurrentUserInfo(userId);
        await this.props.onGetUserLocation();
      }, 20)
    }
  }

  handlePhotoesChange(e) {
    e.preventDefault();
    const target = e.target;

    if (target.type === "file") {
      this.setState({
        multiPhotos: target.files
      });
    }

  }

  handleShowAddHoby(e) {
    e.preventDefault();
    let opt = !this.state.showAddHobi;
    this.setState({
      showAddHobi: opt
    })
  }

  addHobytag(e) {
    e.preventDefault();

    let interests = this.state.interestsArray;
    if (this.state.singleHObbi !== "") {
      let newHobby = { value: this.state.singleHObbi, label: this.state.singleHObbi };
      interests.push(newHobby);
      this.setState({
        singleHObbi: "",
        showAddHobi: false,
        interestsArray: interests
      })
    } else {
      this.setState({
        singleHObbi: "",
        showAddHobi: false,
      })
    }
  }

  handleSelectChange = selectedOption => {
    this.setState(
      { selectedOption },
    );
  };

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
    let photoes = this.getProfilePicture(data.pictures, 0)

    let userInterests = data.tags;

    this.setState({
      firstname: userInfo.firstname,
      psudonym: userInfo.pseudo,
      lastname: userInfo.lastname,
      oldProfilePhoto: profilePhoto.length > 0 ? profilePhoto : "",
      profilePhoto: "",
      email: userInfo.email,
      age: userInfo.age,
      oldMultiPhotos: photoes,
      multiPhotos: [],
      selectedOption: userInterests,
      SexualOrientation: userInfo.sexual_orientation,
      ProfileCompletion: userInfo.profile_completion,
      gender: userInfo.gender,
      location: userInfo.localisation,
      Fame: userInfo.fame,
      Bibliography: userInfo.bio,
    })
  }

  initInterestArray(interests) {
    this.setState({
      interestsArray: interests
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.getProfileInfo.data !== undefined)
      this.initProfileInformation(nextProps.getProfileInfo.data);
    if (nextProps.getUserInterests !== undefined && nextProps.getUserInterests.code === 200)
      this.initInterestArray(nextProps.getUserInterests.data)
    if (nextProps.getProfileInfo !== "" && nextProps.getProfileInfo.code === 204)
      customNotification.fireNotification("error", nextProps.getProfileInfo.msg)
    if (nextProps.getProfileInfo !== "" && nextProps.getProfileInfo.code === 500)
      customNotification.fireNotification("error", nextProps.getProfileInfo.msg)
    if (nextProps.editProfile.msg !== "" && nextProps.editProfile.code === 204)
      customNotification.fireNotification("error", nextProps.editProfile.msg)
    if (nextProps.editProfile.msg !== "" && nextProps.editProfile.code === 500)
      customNotification.fireNotification("error", nextProps.editProfiler.msg)
    if (nextProps.editProfile.msg !== "" && nextProps.editProfile.code === 200)
      customNotification.fireNotification("success", nextProps.editProfile.msg)
    if (this.state.location.trim() === "" && nextProps.locateUser !== undefined) {
      this.setState({
        location: nextProps.locateUser
      })
    }
  }

  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (target.type === "file") {
      this.setState({
        profilePhoto: target.files[0]
      });
    } else
      this.setState({
        [name]: value
      });

  }


  render() {

    if (this.state.location === "")
      this.props.onGetUserLocation();
    return (
      <div>
        <Header />
        <ToastContainer />
        <div className="content-wrapper" >
          <section className="content-header" >
            <br></br>
            <ol className="breadcrumb">
              <li>
                <a href="/">
                  <i className="fa fa-dashboard"></i> Home
                </a>
              </li>
            </ol>
          </section>

          <section className="content">
            <div className="row">
              <div className="col-md-12" id="fixMarginTop">
                <div className="nav-tabs-custom">
                  <ul className="nav nav-tabs">
                    <li className="active">
                      <a href="#settings" data-toggle="tab">
                        Settings
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">

                    <div className="active tab-pane" id="settings">
                      <form onSubmit={this.handlFormSubmitAction} encType="multipart/form-data" className="form-horizontal">

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Firstname
                          </label>

                          <div className="col-sm-10">
                            <input
                              type="text"
                              value={this.state.firstname}
                              className="form-control"
                              id="firstName"
                              onChange={this.handleChange}
                              name="firstname"
                              placeholder="Enter your firstName"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Lastname
                          </label>

                          <div className="col-sm-10">
                            <input
                              type="text"
                              value={this.state.lastname}
                              className="form-control"
                              id="lastName"
                              name="lastname"
                              onChange={this.handleChange}
                              placeholder="Enter your Lastname"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Psudonym
                          </label>

                          <div className="col-sm-10">
                            <input
                              type="text"
                              value={this.state.psudonym}
                              className="form-control"
                              id="psudonym"
                              name="psudonym"
                              onChange={this.handleChange}
                              placeholder="Enter your Lastname"
                            />
                          </div>
                        </div>


                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Email
                          </label>

                          <div className="col-sm-10">
                            <input
                              type="email"
                              className="form-control"
                              id="inputEmail"
                              value={this.state.email}
                              name="email"
                              onChange={this.handleChange}
                              placeholder="Email"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Age
                          </label>

                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control"
                              id="age"
                              value={this.state.age}
                              name="age"
                              onChange={this.handleChange}
                              placeholder="Age"
                            />

                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Gender
                          </label>

                          <div className="col-sm-10">
                            <select className="form-control" name="gender" value={this.state.gender} onChange={this.handleChange}>
                              <option value="" >Select</option>
                              <option value="M" >M</option>
                              <option value="F" >F</option>
                            </select>

                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Location
                          </label>

                          <div className="col-sm-10">
                            <input
                              type="text"
                              value={this.state.location || ""}
                              className="form-control"
                              id="location"
                              name="location"
                              onChange={this.handleChange}
                              placeholder="Enter your location"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Password
                          </label>

                          <div className="col-sm-10">
                            <input
                              type="password"
                              value={this.state.Password}
                              className="form-control"
                              id="Password"
                              name="Password"
                              onChange={this.handleChange}
                              placeholder="Enter your Password"
                            />
                            <p style={{ 'fontSize': '11px' }} className="help-block col-md-7 col-md-offse">
                              Leave the password empty if you dont want to change it
                              </p>
                          </div>

                        </div>
                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            SexualOrientation
                          </label>

                          <div className="col-sm-10">

                            <select className="form-control" name="SexualOrientation" value={this.state.SexualOrientation} onChange={this.handleChange}>
                              <option value="" >Select</option>
                              {/* <option value="A" >Asexual</option> */}
                              <option value="B" >Bisexual</option>
                              <option value="F" >Heterosexual</option>
                              <option value="M" >Homosexual</option>
                            </select>

                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            ProfileCompletion
                          </label>

                          <div className="col-sm-10">
                            <input disabled={true}
                              type="text"
                              value={this.state.ProfileCompletion + " out of 11"}
                              className="form-control"
                              id="ProfileCompletion"
                              name="ProfileCompletion"
                              onChange={this.handleChange}
                              placeholder="Enter your ProfileCompletion link"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Fame
                          </label>

                          <div className="col-sm-10">
                            <input disabled={true}
                              type="text"
                              value={this.state.Fame}
                              className="form-control"
                              id="Fame"
                              name="Fame"
                              onChange={this.handleChange}
                              placeholder="Enter your Lastname"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >interests</label>
                          {this.state.showAddHobi === false ?
                            <button onClick={(e) => { this.handleShowAddHoby(e) }}
                              className="btn btn-info">
                              <i className="fa fa-plus"></i>
                            </button>
                            : <button onClick={(e) => { this.addHobytag(e) }}
                              className="btn btn-success">
                              <i className="glyphicon glyphicon-ok"></i>
                            </button>}
                          <div className="col-sm-9" style={{ 'zIndex': '222' }}>

                            <Select
                              isMulti
                              isSearchable
                              placeholder="Select your interests"
                              value={this.state.selectedOption}
                              onChange={this.handleSelectChange}
                              options={this.state.interestsArray}
                            />

                          </div>
                        </div>

                        {this.state.showAddHobi === true ?

                          <div className="form-group">
                            <label
                              className="col-sm-2 control-label"
                            >
                              New hobby
</label>
                            <div className="col-sm-10">
                              <input
                                type="text"
                                value={this.state.singleHObbi}
                                className="form-control"
                                id="singleHObbi"
                                name="singleHObbi"
                                onChange={this.handleChange}
                                placeholder="Add a new tag for hobby"
                              />
                            </div>
                          </div>
                          : ""}

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Upload a photoes
                          </label>


                          <div className="input-group image-preview col-md-8 files">

                            <input type="file" name="multiPhotos" onChange={this.handlePhotoesChange} multiple accept="image/png, image/jpeg, image/gif" />
                            <p className="help-block col-md-7">Only 4 photoes and format JPEG/PNG allowed.</p>
                          </div>
                        </div>
                        <div className="input-group image-preview col-md-10 col-md-offset-2">
                          {this.state.oldMultiPhotos && this.state.multiPhotos.length === 0 ?
                            this.state.oldMultiPhotos.map((oldProfilePhoto, index) => {
                              return (<img key={index} style={{ position: 'relative', float: 'left', width: '200px' }}
                                className="img-responsive center-block"
                                src={oldProfilePhoto.toString().substring(0, 5) === 'https' ?
                                oldProfilePhoto :
                                  process.env.REACT_APP_API_URL +
                                  "/" +
                                  oldProfilePhoto
                                } alt="pic holder"
                              />)
                            }) : ""}
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Profile photo
                          </label>

                          <div className="input-group image-preview col-md-8">
                            <input type="text" className="form-control image-preview-filename" value={this.state.profilePhoto.name ? this.state.profilePhoto.name : this.state.profilePhoto} disabled="disabled" />
                            <span className="input-group-btn">

                              <div className="btn btn-default image-preview-input">
                                <span className="glyphicon glyphicon-folder-open"></span>
                                <span className="image-preview-input-title">   Browse</span>
                                <input id="Photo" name="profilePhoto" onChange={this.handleChange} type="file" accept="image/png, image/jpeg, image/gif" />
                              </div>
                            </span>
                          </div>
                          <div className="input-group image-preview col-md-10 col-md-offset-2">
                            {this.state.oldProfilePhoto && this.state.profilePhoto === "" ? <img style={{ position: 'relative', float: 'left', width: '200px' }}
                              className="img-responsive center-block"
                              src={this.state.oldProfilePhoto.toString().substring(0, 5) === 'https' ?
                              this.state.oldProfilePhoto : 
                                process.env.REACT_APP_API_URL +
                                "/" +
                                this.state.oldProfilePhoto[0]
                              }
                              alt="pic holder"
                            />
                              : ""}
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            className="col-sm-2 control-label"
                          >
                            Bibliography
                          </label>

                          <div className="col-sm-10">
                            <textarea
                              value={this.state.Bibliography}
                              id="Bibliography" name="Bibliography"
                              rows="5" cols="42" onChange={this.handleChange}>
                            </textarea>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-info">
                              Update
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Sidebar />
        <Footer />
      </div >
    );
  }
}

const state = (state, ownProps = {}) => {
  return {
    locateUser: state.locateUser.locateUser,
    getUserInterests: state.getUserInterests.getUserInterests,
    getProfileInfo: state.getProfileInfo.getProfileInfo,
    editProfile: state.editProfile.profileEdited,
    location: state.location,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    navigateTo: (location) => {
      dispatch(push(location));
    },
    onEditThisUser: (data) => dispatch(editThisUser(data)),
    onGetUserInfo: (userId) => dispatch(GetUserInfo(userId)),
    onGetUserIntrests: (userId) => dispatch(GetUserIntrests(userId)),
    onGetUserLocation: () => dispatch(getUserLocation()),
    onGetCurrentUserInfo: (userId) => dispatch(GetCurrentUserInfo(userId)),
  }
};

export default connect(
  state,
  mapDispatchToProps
)(Profile);
