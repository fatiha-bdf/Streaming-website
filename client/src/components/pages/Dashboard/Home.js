
import React from "react";
import Header from '../../common/Header';
import Sidebar from '../../common/SideBar';
import Footer from '../../common/Footer';
import SearchBar from './SearchBar';
import ResultUser from './ResultUser';
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { fetchAllUsersPublicData } from '../../../store/actions/UsersActions/fetchAllUsersPublicDataAction';
import io from 'socket.io-client';
import sort from 'fast-sort';
import { GetUserIntrests } from '../../../store/actions/intrestsActions/GetAllInterestsAction';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sortBy: 'age',
            initialUsers: [],
            interestsArray: [],
            userBuffer: []
        }

        this.onChange = this.onChange.bind(this);
        this.filterUsers = this.filterUsers.bind(this);
    }

    async UNSAFE_componentWillMount() {
        await this.props.onfetchAllUsersPublicData([]);
        const userId = localStorage.getItem("userId");
        await this.props.onGetUserIntrests(userId);
    }

    onChange = async (e) => {
        console.log(e.target.value);
        if (e.target.name !== 'sortBy'){
            e.preventDefault();
        }         
        this.setState({ [e.target.name]: e.target.value })

        setTimeout(async () => {
            await this.filterUsers();
        }, 50);
        // await this.filterUsers();
        // console.log(this.state[e.target.name]);

    }

    initUsers(users) {
        this.setState({
            initialUsers: users,
            userBuffer: users
        });
    }

    initInterestArray(interests) {
        this.setState({
            interestsArray: interests
        })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.getUserInterests !== undefined && nextProps.getUserInterests.code === 200)
        this.initInterestArray(nextProps.getUserInterests.data)
        if (nextProps.fetchAllUsersPublicData !== undefined && nextProps.fetchAllUsersPublicData.code === 200)
            this.initUsers(nextProps.fetchAllUsersPublicData.data);
    }


    async filterUsers () {

        let buffer = [];
        buffer = this.state.initialUsers;
        // console.log(buffer);

        //SORT
        //sort by fame and age
        if (this.state.sortBy === 'fame' || this.state.sortBy === 'age'){
            buffer = sort(buffer).asc(u => u[this.state.sortBy]);
            console.log(buffer);
            this.setState({
                userBuffer: buffer
            })
        //sort by distance
        } else if(this.state.sortBy === 'location') {
            buffer = sort(buffer).asc(u => u.distance);
            // console.log(buffer);
            this.setState({
                userBuffer: buffer
            })
        //sort by tags
        } else if (this.state.sortBy === 'tags') {
            //on a une liste de tags.
            //on veut que les utilisateurs qui ont le premier element de la liste de tags arrive en premier puis les deuxieme arrive ensuite
            var tags = [];
            if (this.state.interestsArray !== null){
                this.state.interestsArray.forEach(element => {
                    tags.push(element.value);
                });
            }
            var newbuffer = [];
            tags.forEach(tagfromlist => {
                buffer.forEach(element => {
                    element.tags.forEach(taguser => {
                        if(taguser === tagfromlist) {
                            newbuffer.push(element);
                        }
                    });
                });
            });
            // console.log(buffer);
            buffer = newbuffer;
            this.setState({
                userBuffer: buffer
            })
        }
    }

    render() {
        let filteredUsers = this.state.userBuffer;
        return (
            <div>
                <Header />
                <Sidebar />
                <div>
                    <div className="content-wrapper">
                        <section className="content">

                            <section className="content">
                                <br />
                                <SearchBar />
                                <div style={{ padding: '2rem' }}>
                                    <div style={{ backgroundColor: 'grey', height: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <h4>SORT BY</h4></div>
                                    <div style={{ backgroundColor: 'grey', height: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={somemargin}>
                                            <div>Age</div>
                                            <input type="radio" name="sortBy" value="age" checked={this.state.sortBy === 'age'} onChange={this.onChange} />
                                        </div>
                                        <div style={somemargin}>
                                            <div>Distance</div>
                                            <input type="radio" name="sortBy" value="location" checked={this.state.sortBy === 'location'} onChange={this.onChange} />
                                        </div>
                                        <div style={somemargin}>
                                            <div>Tags</div>
                                            <input type="radio" name="sortBy" value="tags" checked={this.state.sortBy === 'tags'} onChange={this.onChange} />
                                        </div>
                                        <div style={somemargin}>
                                            <div>Fame</div>
                                            <input type="radio" name="sortBy" value="fame" checked={this.state.sortBy === 'fame'} onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                                <ResultUser users={filteredUsers} />

                            </section>


                        </section>
                    </div>
                </div>
                <Footer />
            </div>

        );
    }
}

const somemargin = { textAlign: 'center', width: '24%'}

const state = (state, ownProps = {}) => {
    return {
        fetchAllUsersPublicData: state.fetchAllUsersPublicData.fetchAllUsersPublicData,
        location: state.location,
        getUserInterests: state.getUserInterests.getUserInterests,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateTo: (location) => {
            dispatch(push(location));
        },
        onGetUserIntrests: (userId) => dispatch(GetUserIntrests(userId)),
        onfetchAllUsersPublicData: (filter) => dispatch(fetchAllUsersPublicData(filter))
    }
};

export default connect(state, mapDispatchToProps)(Home);
