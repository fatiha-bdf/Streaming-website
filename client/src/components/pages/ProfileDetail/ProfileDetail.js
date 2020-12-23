import React from "react";
import Header from "../../common/Header";
import Sidebar from "../../common/SideBar";
import Footer from "../../common/Footer";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { GetUserInfo } from '../../../store/actions/UsersActions/FetchUserInfoAction';
import { GetUserIntrests } from '../../../store/actions/intrestsActions/GetAllInterestsAction';
import { GetuserLikes } from '../../../store/actions/UsersActions/GetUserlikesDislikesAction';
import { PutUpdateUserLikes } from '../../../store/actions/UsersActions/UpdateUserLikeDislikeAction';
import { BlockThisUser } from "../../../store/actions/UsersActions/BlockUserAction";
import { VisitThisUser } from '../../../store/actions/UsersActions/VisitUserAction';
import Moment from 'moment';
import { PutUpdateUserUnlikes } from '../../../store/actions/UsersActions/UpdateUserUnlikes';
import { reportThisUser } from '../../../store/actions/UsersActions/ReportUserAction';
import { ToastContainer } from 'react-toastify';
import io from 'socket.io-client';
const customNotification = require('../utils/notification');

class ProfileDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            likes: 0,
            dislikes: 0,
            singleHObbi: "",
            psudonym: "",
            socket: io(process.env.REACT_APP_API_URL),
            lastname: "",
            showAddHobi: false,
            countLikes: 0,
            userHasLikedMe: "",
            countdisLikes: 0,
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
            online: "",
            updatedAt: "",
            gender: "",
            location: "",
            Fame: "",
            Bibliography: "",
            selectedOption: [],
        };

        this.handlelikes = this.handlelikes.bind(this);
        this.handleBlock = this.handleBlock.bind(this);
        this.handleReport = this.handleReport.bind(this);
    }

    async handleBlock(e) {
        e.preventDefault();
        let userId = this.props.match.params.id;
        await this.props.onBlockThisUser(userId);
        let userAction = localStorage.getItem("userId");

        setTimeout(() => {
            let data = {
                id: userAction + userId,
                title: "block",
                fullname: "",
                msg: " blocked your profile",
                likerId: userAction,
                likedId: userId,
                time: Moment()
            }
            this.state.socket.emit('likeUser', data)
        }, 320)
    }

    async handleReport(e) {
        e.preventDefault();
        let userId = this.props.match.params.id;
        await this.props.onreportThisUser(userId);
        let userAction = localStorage.getItem("userId");

        setTimeout(() => {
            let data = {
                id: userAction + userId,
                title: "report",
                fullname: "",
                msg: " reported your profile",
                likerId: userAction,
                likedId: userId,
                time: Moment()
            }
            this.state.socket.emit('likeUser', data)
        }, 320)
    }

    async handlelikes(e, state) {
        e.preventDefault();
        let userId = this.props.match.params.id;
        let userAction = localStorage.getItem("userId");

        await this.props.onPutUpdateUserLikes(userId, state);
        setTimeout(async () => {
            await this.props.onGetuserLikes(userId);
        }, 10)

        setTimeout(() => {
            let data = {
                id: userAction + userId,
                title: "",
                fullname: "",
                msg: "",
                likerId: userAction,
                likedId: userId,
                time: Moment()
            }

            if (this.state.countDislikes < this.state.dislikes)
                if (state === 1) {
                    data.title = "dislike";
                    data.msg = " disliked your profile";
                    this.state.socket.emit('likeUser', data)
                }

            if (this.state.countLikes < this.state.likes)
                if (state === 0) {
                    data.msg = " liked your profile";
                    data.title = "like";
                    this.state.socket.emit('likeUser', data)
                }

            if (this.state.countLikes > this.state.likes) {
                this.props.onPutUpdateUserUnlikes(userId);
                if (state === 0) {
                    data.msg = " unliked your profile";
                    data.title = "unlike";
                    this.state.socket.emit('likeUser', data)
                }
            }


            let init = this.state.likes;
            let initDislike = this.state.dislikes;
            this.setState({
                countLikes: init,
                countDislikes: initDislike
            })
        }, 320)
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
        let photoes = this.getProfilePicture(data.pictures, 0)

        let userInterests = data.tags;

        this.setState({
            userHasLikedMe: data.liked,
            firstname: userInfo.firstname,
            psudonym: userInfo.pseudo,
            lastname: userInfo.lastname,
            oldProfilePhoto: profilePhoto.length > 0 ? profilePhoto : "",
            profilePhoto: "",
            email: userInfo.email,
            online: userInfo.online,
            updatedAt: userInfo.updatedAt,
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
        if (nextProps.getUserLikes.data !== undefined)
            this.setState({
                likes: nextProps.getUserLikes.data.likes,
                dislikes: nextProps.getUserLikes.data.dislikes
            })
        if (nextProps.getProfileInfo.data !== undefined)
            this.initProfileInformation(nextProps.getProfileInfo.data);
        if (nextProps.getUserInterests !== undefined && nextProps.getUserInterests.code === 200)
            this.initInterestArray(nextProps.getUserInterests.data)
        if (nextProps.blockUser !== undefined && nextProps.blockUser.code === 200)
            customNotification.fireNotification("success", nextProps.blockUser.msg)
        if (nextProps.reportUser !== undefined && nextProps.reportUser.code === 200)
            customNotification.fireNotification("success", nextProps.reportUser.msg)
    }


    async UNSAFE_componentWillMount() {
        let userId = this.props.match.params.id;
        await this.props.onGetUserInfo(userId);
        await this.props.onGetUserIntrests(userId);
        await this.props.onGetuserLikes(userId);
        await this.props.onVisitThisUser(userId);
        let userAction = localStorage.getItem("userId");

        setTimeout(() => {
            let likes = this.state.likes;
            let dislike = this.state.dislikes;
            this.setState({
                countLikes: likes,
                countDislikes: dislike
            })

            let data = {
                id: userAction + userId,
                title: "visit",
                fullname: "",
                msg: " has visited your profile",
                likerId: userAction,
                likedId: userId,
                time: Moment()
            }

            this.state.socket.emit('likeUser', data)
        }, 300)
    }

    componentWillUnmount() {
        this.state.socket.disconnect(true);
    }

    componentDidMount() {
        let room = localStorage.getItem("userId");
        this.state.socket.connect(true);
        this.state.socket.emit('join', room);
    }

    render() {


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
                            <div className="col-md-12">
                                <div className="box box-primary" id="fixMarginTop">
                                    <div className="box-body box-profile">
                                        {this.state.oldProfilePhoto && this.state.profilePhoto === "" ?
                                            <img
                                                className="profile-user-img img-responsive img-circle"

                                                src={this.state.oldProfilePhoto.toString().substring(0, 4) !== 'http' ?
                                                    process.env.REACT_APP_API_URL +
                                                    "/" +
                                                    this.state.oldProfilePhoto :
                                                    this.state.oldProfilePhoto
                                                }
                                                alt="pic holder"
                                            />
                                            : ""}


                                        <h3 className="profile-username text-center">
                                            {this.state.firstname}{" "}
                                            {this.state.lastname}
                                        </h3>

                                        <h5 style={{ 'fontSize': '16px' }} className="text-muted text-center">
                                            {this.state.online === 0 ?
                                                "Last login : " +
                                                Moment().format('ll', this.state.updatedAt)
                                                :
                                                "this user is online"}
                                        </h5>
                                        <h5 style={{ 'fontSize': '12px' }} className="text-muted text-center">
                                            {this.state.online === 0 ?
                                                Moment(this.state.updatedAt).fromNow()
                                                :
                                                ""}
                                        </h5>

                                        <h5 style={{ 'fontSize': '12px' }} className="text-muted text-center">
                                            {this.state.userHasLikedMe === true ?
                                                "This User liked me" :
                                                ""}
                                        </h5>

                                        <ul className="list-group list-group-unbordered text-center">
                                            <li className="list-group-item">
                                                {this.state.oldProfilePhoto === "" && this.state.oldMultiPhotos.length === 0
                                                    ? "" : <span>
                                                        <button onClick={(e) => { this.handlelikes(e, 0) }} className="btn btn-primary">Like {this.state.likes}</button>
                                                        <button onClick={(e) => { this.handlelikes(e, 1) }} className="btn btn-warning">Dislike {this.state.dislikes}</button>

                                                    </span>}
                                                <button onClick={(e) => { this.handleBlock(e) }} className="btn btn-danger">Block</button>
                                                <button onClick={(e) => { this.handleReport(e) }} className="btn btn-danger">Report</button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">About Me</h3>
                                    </div>
                                    <div className="box-body">
                                        <strong>
                                            <i className=" margin-r-5"></i> Pseudo : {this.state.psudonym}
                                        </strong>

                                        <hr></hr>

                                        <strong>
                                            <i className=" margin-r-5"></i> Age : {this.state.age}
                                        </strong>
                                        <hr></hr>

                                        <strong>
                                            <i className=" margin-r-5"></i> Gender : {this.state.gender}
                                        </strong>
                                        <hr></hr>

                                        <strong>
                                            <i className=" margin-r-5"></i> Location : {this.state.location}
                                        </strong>


                                        <hr></hr>

                                        <strong>
                                            <i className=" margin-r-5"></i> SexualOrientation : {this.state.SexualOrientation}
                                        </strong>

                                        <hr></hr>

                                        <strong>
                                            <i className=" margin-r-5"></i> Profile completion : {this.state.ProfileCompletion}
                                        </strong>
                                        <hr></hr>

                                        <strong>
                                            <i className=" margin-r-5"></i> Fame : {this.state.Fame}
                                        </strong>

                                        <hr></hr>
                                        <strong>
                                            <i className=" margin-r-5"></i> Interests :
                                        </strong>

                                        {this.state.selectedOption ? this.state.selectedOption.map((hobi, i) => {
                                            return <p key={i}>{hobi.label}</p>
                                        }) : ""}

                                        <hr></hr>
                                        <strong>
                                            <i className=" margin-r-5"></i> Images :
                                        </strong>

                                        <div className="input-group image-preview col-md-10 col-md-offset-2">
                                            {this.state.oldMultiPhotos && this.state.multiPhotos.length === 0 ?
                                                this.state.oldMultiPhotos.map((oldProfilePhoto, index) => {
                                                    return (<img key={index} style={{ position: 'relative', float: 'left', width: '200px' }}
                                                        className="img-responsive center-block"
                                                        src={oldProfilePhoto.indexOf("http") !== 1 ?
                                                            process.env.REACT_APP_API_URL +
                                                            "/" +
                                                            oldProfilePhoto : oldProfilePhoto
                                                        } alt="pic holder"
                                                    />)
                                                }) : ""}
                                        </div>
                                        <div>
                                            {/* <p style={{ height: '140px', lineHeight: '20px', overflow: 'hidden' }}>
                                                {this.state.note}
                                            </p> */}
                                        </div>


                                        <hr></hr>
                                        <strong>
                                            <i className=" margin-r-5"></i> Bibliography : {this.state.Bibliography}
                                        </strong>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <Sidebar />
                <Footer />
            </div>
        );
    }
}

const state = (state, ownProps = {}) => {
    return {
        reportUser: state.reportUser.reportUser,
        blockUser: state.blockUser.blockUser,
        getUserLikes: state.getUserLikes.getUserLikes,
        location: state.location,
        getUserInterests: state.getUserInterests.getUserInterests,
        getProfileInfo: state.getProfileInfo.getProfileInfo,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateTo: (location) => {
            dispatch(push(location));
        },
        onGetUserInfo: (userId) => dispatch(GetUserInfo(userId)),
        onGetUserIntrests: (userId) => dispatch(GetUserIntrests(userId)),
        onGetuserLikes: (userId) => dispatch(GetuserLikes(userId)),
        onPutUpdateUserLikes: (userId, cheker) => dispatch(PutUpdateUserLikes(userId, cheker)),
        onBlockThisUser: (blocked_userId) => dispatch(BlockThisUser(blocked_userId)),
        onVisitThisUser: (visited_userId) => dispatch(VisitThisUser(visited_userId)),
        onreportThisUser: (reported_userId) => dispatch(reportThisUser(reported_userId)),
        onPutUpdateUserUnlikes: (userId) => dispatch(PutUpdateUserUnlikes(userId))
    }
};

export default connect(
    state,
    mapDispatchToProps
)(ProfileDetails);
