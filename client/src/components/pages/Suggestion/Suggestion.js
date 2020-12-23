import React, { Component } from 'react'
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Header from '../../common/Header';
import Sidebar from '../../common/SideBar';
import Footer from '../../common/Footer';
import SuggestionAlert from './SuggestionAlert';
import { GetUserInfo } from '../../../store/actions/UsersActions/FetchUserInfoAction';
import { getUserLocation } from '../../../store/actions/UsersActions/GetUserLocationAction';
import { GetCurrentUserInfo } from '../../../store/actions/UsersActions/FetchCurrentUserInfoAction';
import { fetchAllUsersPublicData } from '../../../store/actions/UsersActions/fetchAllUsersPublicDataAction';
import SuggestionList from './SuggestionList';

export class Suggestion extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          firstname: "",
          singleHObbi: "",
          psudonym: "",
          lastname: "",
          email: "",
          age: "",
          multiPhotos: [],
          interestsArray: [],
          SexualOrientation: "",
          ProfileCompletion: "",
          gender: "",
          location: "",
          Fame: "",
          Bibliography: "",
          selectedOption: [],
          users: []
        };
      }

      initProfileInformation(data) {
        let userInfo = data.info;
    
        let userInterests = data.tags;
    
        this.setState({
          firstname: userInfo.firstname,
          psudonym: userInfo.pseudo,
          lastname: userInfo.lastname,
          email: userInfo.email,
          age: userInfo.age,
          selectedOption: userInterests,
          SexualOrientation: userInfo.sexual_orientation,
          ProfileCompletion: userInfo.profile_completion,
          gender: userInfo.gender,
          location: userInfo.localisation,
          Fame: userInfo.fame,
          Bibliography: userInfo.bio,
        })
        setTimeout(() => {
            // console.log(this.state);
          }, 500)
      }

    initUsers(users) {
        this.setState({
            users: users
        });
        setTimeout(() => {
        //   console.log(this.state.users);
        }, 500)
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
        if (this.state.location === "" && nextProps.locateUser !== "")
            this.setState({
                location: nextProps.locateUser
            })
        if (nextProps.fetchAllUsersPublicData !== undefined && nextProps.fetchAllUsersPublicData.code === 200)
            this.initUsers(nextProps.fetchAllUsersPublicData.data);
    }

      async UNSAFE_componentWillMount() {
        const userId = localStorage.getItem("userId");

        await this.props.onGetUserLocation();
        await this.props.onGetUserInfo(userId);
        let filter = {};
        setTimeout(async (filter) => {
            var tag_array = [];
            if (this.state.selectedOption !== null){
                this.state.selectedOption.forEach(element => {
                    tag_array.push(element.value);
                });
            }
            filter = {Suggestion: true, fame: parseInt(this.state.Fame), location: this.state.location, age: this.state.age, tags: tag_array, wants: this.state.SexualOrientation};
            
            await this.props.onfetchAllUsersPublicData(filter);
            // setTimeout(()=> console.log(this.state), 500)
        }, 600);
      }
    
    render() {

        return (
            <div>
                <Header />
                <Sidebar />
                <div className="content-wrapper">
                        <section className="content">

                            <section className="content">
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                {this.state.ProfileCompletion < 8 ? <SuggestionAlert link={'/profile'} message={'Your profile is not complete, please update it'}/> :
                                <div>
                                  { this.state.users.length === 0 ? <div> Hmm strange, we didn't find anybody that fit your profile. Please make sure you added some popular tags to your profile. Or maybe you have nobody in a 10 000km radius that fits your sexual preferences</div> :
                                  <SuggestionList  users={this.state.users} interestsArray={this.state.selectedOption}/>
                                  }
                                </div>
                                }
                            </section>


                        </section>
                    </div>
                <Footer />
            </div>
        )
    }
}

const state = (state, ownProps = {}) => {
    return {
      locateUser: state.locateUser.locateUser,
      getUserInterests: state.getUserInterests.getUserInterests,
      getProfileInfo: state.getProfileInfo.getProfileInfo,
      location: state.location,
      fetchAllUsersPublicData: state.fetchAllUsersPublicData.fetchAllUsersPublicData
    }
  }

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      navigateTo: (location) => {
        dispatch(push(location));
      },
      onGetUserInfo: (userId) => dispatch(GetUserInfo(userId)),
      onGetUserLocation: () => dispatch(getUserLocation()),
      onGetCurrentUserInfo: (userId) => dispatch(GetCurrentUserInfo(userId)),
      onfetchAllUsersPublicData: (filter) => dispatch(fetchAllUsersPublicData(filter))
    }
  };

export default connect(
    state,
    mapDispatchToProps
  )(Suggestion);