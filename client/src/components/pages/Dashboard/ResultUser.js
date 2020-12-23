import React, { Component } from 'react';
import UserItem from './UserItem';

export class ResultUser extends Component {

    render() {
        const users = this.props.users;
        return (
            <div style={userStyle}>
                {users.map((user, i) => <UserItem key={i} user={user}/>)}
            </div>
        )
    }
}

const userStyle = {
    // display: 'grid',
    // gridTemplateColumns: 'repeat(4, 1fr)',
    // gridGap: '1rem'
    width: '100%',
    display: 'flex',
    'flexWrap': 'wrap',
    'justifyContent': 'center'

}

export default ResultUser
