import React, { Component } from 'react'
import Header from '../../common/Header';
import Sidebar from '../../common/SideBar';
import Footer from '../../common/Footer';
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router-dom";
import NotificationItem from './NotificationItem';
import { GetuserNotifes } from '../../../store/actions/UsersActions/GetUserNotifiAction';
import Moment from 'moment';
import io from 'socket.io-client';

export class NotificationsHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifs: [],
            socketNotif: [],
            socket: io(process.env.REACT_APP_API_URL),
        }

    }

    async UNSAFE_componentWillMount() {
        await this.props.onGetuserNotifes();
        let room = localStorage.getItem("userId");
        this.state.socket.connect(true);
        this.state.socket.emit('join', room);
    }

    componentDidMount() {
        let dataNotif = this.state.socketNotif;
        this.state.socket.on('userLikesList', (likes) => {
            dataNotif = dataNotif.concat(likes)
            this.setState({
                socketNotif: dataNotif
            })
        })
    }

    componentWillUnmount() {
        let room = localStorage.getItem("userId");
        this.state.socket.emit('initLikesList', room)
        this.state.socket.disconnect(true);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.getUserNotifs.code === 200)
            this.setState({
                notifs: nextProps.getUserNotifs.data
            })
    }

    render() {
        return (
            <div>
                <Header />
                <Sidebar />
                <div>
                    <div className="content-wrapper">
                        <section className="content">
                            <section className="content">
                                <div className="row">
                                    <h1>NEW</h1>
                                    {this.state.socketNotif !== undefined ?
                                        this.state.socketNotif.map((notif, i)=> {
                                            return <NotificationItem key={i} notif={{ id: notif.likerId, from: notif.fullname, option: { type: notif.title, read: false }, date: Moment(notif.time).fromNow() }} />
                                        })
                                        : ""}


                                    <h1>SEEN</h1>
                                    {this.state.notifs ?
                                        this.state.notifs.map((notif, i) => {
                                            return notif.seen === 0 ?
                                                <NotificationItem key={i} notif={{ id: notif.id, from: notif.fullname, option: { type: notif.categorie, read: false }, date: Moment(notif.updatedAt).fromNow() }} />
                                                : ""
                                        })
                                        : ""}
                                    {/* <NotificationItem notif={{ from: 'Patricia', option: { type: 'message', read: false, message: 'Salut Salut je m\'apelle Patricia et mon prenom commence par un P comme patapouf, Salut Salut je m\'apelle Patricia et mon prenom commence par un P comme patapouf, Salut Salut je m\'apelle Patricia et mon prenom commence par un P comme patapouf' }, date: 'DISPLAY DATE' }} />
                                    <NotificationItem notif={{ from: 'Patricia', option: { type: 'like', read: false }, date: 'DISPLAY DATE' }} />
                                    <NotificationItem notif={{ from: 'Patricia', option: { type: 'visit', read: false }, date: 'DISPLAY DATE' }} />
                                    <h1>SEEN</h1>
                                    <NotificationItem notif={{ from: 'Edgard', option: { type: 'message', read: true, message: 'On bez ?' }, date: 'DISPLAY DATE' }} />
                                    <NotificationItem notif={{ from: 'Edgard', option: { type: 'like', read: true }, date: 'DISPLAY DATE' }} />
                                    <NotificationItem notif={{ from: 'Edgard', option: { type: 'visit', read: true }, date: 'DISPLAY DATE' }} /> */}
                                </div>
                            </section>
                        </section>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

const state = (state, ownProps = {}) => {
    return {
        getUserNotifs: state.getUserNotifs.getUserNotifs,
        location: state.location,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateTo: (location) => {
            dispatch(push(location));
        },
        onGetuserNotifes: () => dispatch(GetuserNotifes())
    }
};

export default connect(
    state,
    mapDispatchToProps
)(NotificationsHome);
