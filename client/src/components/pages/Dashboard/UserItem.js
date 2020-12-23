import React, { Component } from 'react'
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router-dom";

export class UserItem extends Component {

    handleChargeUser = (e) => {
        e.preventDefault();
    }

    render() {
        var image, name, hobbies, description;
        if (this.props.user.images.profile_pic)
            image = this.props.user.images.profile_pic;
        else
            image = 'https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=592&q=80';
        if (this.props.user.firstname)
            name = this.props.user.firstname;
        else
            name = 'Patrick';
        if (this.props.user.tags)
            hobbies = this.props.user.tags;
        else
            hobbies = ['biere', 'foot', 'netflix'];
        if (this.props.user.bio)
            description = this.props.user.bio;
        else
            description = 'salut les amis';
        // const {image, name, hobbies, description} = this.props.user;

        return (
            <div className="card text-center" style={{ width: "18rem", height: "40rem", float: 'left', margin: '1rem' }}>
                <div className="" style={{ width: "18rem", height: "22rem", overflow: 'hidden', position: 'relative', display: 'flex', 'alignItems': 'center' }}>
                    <img src={image.substring(0, 4) !== 'http' ?
                    process.env.REACT_APP_API_URL +
                    "/" + image : image} className="card-img-top " alt="" style={{ 'objectFit': 'cover', width: '100%' }} />
                </div>
                <h3 className="card-title">{name}</h3>
                <nav style={{ display: 'flex', justifyContent: 'space-around', overflow: 'hidden' }}>
                    {hobbies.map((hobbie, i) => i < 3 && <h5 className="card-subtitle" style={{ borderRadius: '5px', border: '1px solid gainsboro', padding: '1px' }} key={i}>{hobbie.substr(0, 10) !== hobbie ? hobbie.substr(0, 10) + '...' : hobbie}</h5>)}
                </nav>
                <p style={{ height: '4rem' }}>{description.substr(0, 40) === description ? description : description.substr(0, 40) + '...'}</p>
                <Link to={"/profiledetail/" + this.props.user.id} onClick={this.props.navigateTo.bind(this, '/profiledetail/' + this.props.user.id)}>
                    <button className="btn btn-secondary btn-block" style={{ backgroundColor: '#fcbde6' }}>See more</button>
                </Link>
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
)(UserItem);

