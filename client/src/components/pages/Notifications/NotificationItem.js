import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import io from 'socket.io-client';

export class NotificationItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io(process.env.REACT_APP_API_URL),
        }
    }

    UNSAFE_componentWillMount() {
        let room = localStorage.getItem("userId");
        this.state.socket.connect(true);
        this.state.socket.emit('join', room);
    }

    componentDidMount() {
        let room = localStorage.getItem("userId");
        this.state.socket.emit('initNotification', room)
    }

    componentWillUnmount() {
        this.state.socket.disconnect(true);
    }

    render() {

        const { from, option, date, id } = this.props.notif;
        let type = '';
        let styling = {};
        let type_ico = '';
        let message = '';
        let type_message = '';
        if (option.type === 'message') {
            type = 'alert alert-success';
            type_ico = 'fa fa-envelope text-blue';
            type_message = ' has sent you a message';
            styling = { border: '1px solid blue' };
            //Salut Salut je m'apelle Patricia et mon prenom commence par un P comme patapouf
            if (option.message !== null)
                message = option.message;
        } else if (option.type === 'visit') {
            type = 'alert alert-warning';
            type_ico = 'fa fa-eye';
            type_message = ' has visited profil.';
        } else if (option.type === 'like') {
            type = 'alert alert-info';
            type_ico = 'fa fa-thumbs-up';
            type_message = ' liked your profile'
        } else if (option.type === 'dislike') {
            type = 'alert alert-warning';
            type_ico = 'fa fa-thumbs-down';
            type_message = ' disliked your profile'
        } else if (option.type === 'block') {
            type = 'alert alert-danger';
            type_ico = 'fa fa-ban';
            type_message = ' blocked your profile'
        }  else if (option.type === 'report') {
            type = 'alert alert-danger';
            type_ico = 'fa fa-ban';
            type_message = ' reported your profile'
        } else if (option.type === 'unlike') {
            type = 'alert alert-info';
            type_ico = 'fa fa-trash';
            type_message = ' unliked your profile'
        }

        if (option.read === true) {
            type = 'alert alert-success';
            styling = {};
            if (option.type === 'message') {
                type_ico = 'fa fa-envelope';
            }
        }

        return (
            <div className={type} style={styling}>
                <div className="" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="col-md-auto">
                        <i className={type_ico} style={{ marginRight: '10px' }}></i>
                        <Link style={{ color: 'white', textDecoration: 'none'}} to={`/profiledetail/${id}`} onClick={this.props.navigateTo.bind(this, `/profiledetail/${id}`)}>
                            <span><strong style={{ color: 'white', textDecoration: 'none', marginRight: '4px' }}>{from}</strong></span>
                        </Link>
                        {type_message} <em>{message}</em>
                    </div>
                    <div className="col col-lg-2">
                        {date}
                    </div>
                </div>
            </div>
        )
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
    }
};

export default connect(
    state,
    mapDispatchToProps
)(NotificationItem);
