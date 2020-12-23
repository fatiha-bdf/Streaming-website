import React, { Component } from 'react'
import { Range } from 'rc-slider';
import Select from 'react-select';
import { GetUserIntrests } from '../../../store/actions/intrestsActions/GetAllInterestsAction';
import { connect } from "react-redux";
import { push } from "react-router-redux";
import ResultUser from './../Dashboard/ResultUser';
import sort from 'fast-sort';

export class SuggestionList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sortBy: 'age',
            lowerBound: 18,
            upperBound: 75,
            value: [18, 75],
            SearchBar: '',
            rangeFame: 0,
            rangeLocalisation: 10000,
            SearchBarTags: '',
            interestsArray: [],
            selectedOption: [],
            location: "",
            initialUsers: this.props.users,
            userBuffer: []
        }

        this.handleUsersFilter = this.handleUsersFilter.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }


    async handleUsersFilter(e) {
        e.preventDefault();
        let filter = [{
            userPos: this.state.location,
            rangeFame: this.state.rangeFame,
            age: this.state.value,
            interests: this.state.selectedOption,
            rangeLocalisation: parseInt(this.state.rangeLocalisation)
        }]

        await this.props.onfetchAllUsersPublicData(filter);
    }

    onLowerBoundChange = (e) => {
        this.setState({ lowerBound: +e.target.value });
    }
    onUpperBoundChange = (e) => {
        this.setState({ upperBound: +e.target.value });
    }
    onSliderChange = async (value) => {
        this.setState({
            value,
        });
        await this.filterUsers();
        // console.log(this.state.value);
    }
    handleApply = () => {
        const { lowerBound, upperBound } = this.state;
        this.setState({ value: [lowerBound, upperBound] });
    }

    handleSelectChange = selectedOption => {
        this.setState(
            { selectedOption },
        );
        setTimeout(async () => {
            await this.filterUsers();
        }, 50);
    };

    onChange = async (e) => {
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

    async UNSAFE_componentWillMount() {
        const userId = localStorage.getItem("userId");
        this.setState({interestsArray: this.props.interestsArray})
        await this.props.onGetUserIntrests(userId);
        await this.filterUsers();
    }


    async filterUsers () {

        let buffer = [];
        buffer = this.state.initialUsers;

        //FILTER
        //filter by age
        var AgeMin = this.state.value[0];
        var AgeMax = this.state.value[1];
        var tmpbuff = [];
        buffer.forEach(user => {
            if (user.age >= AgeMin && user.age <= AgeMax){
                tmpbuff.push(user);
            }
        });
        buffer = tmpbuff;
        //filter by fame
        var fame = this.state.rangeFame;
        var tmpbuff = [];
        buffer.forEach(user => {
            if (user.fame >= fame){
                tmpbuff.push(user);
            }
        });
        buffer = tmpbuff;
        //filter by dist
        var dist = this.state.rangeLocalisation;
        var tmpbuff = [];
        buffer.forEach(user => {
            if (user.distance <= dist){
                tmpbuff.push(user);
            }
        });
        buffer = tmpbuff;
        //filter by interests
        var tagss = [];
        var tmpbuff = [];
        if (this.state.selectedOption !== null){
            this.state.selectedOption.forEach(element => {
                tagss.push(element.value);
            });
        }
        if (tagss.length !== 0) {
            buffer.forEach(element => {
                element.tags.forEach(tag => {
                    tagss.forEach(filter_tag => {
                        if (filter_tag === tag){
                            tmpbuff.push(element);
                        }
                    })
                })
            });
            buffer = tmpbuff;
        } 

        //SORT
        //sort by fame and age
        if (this.state.sortBy === 'fame' || this.state.sortBy === 'age'){
            buffer = sort(buffer).asc(u => u[this.state.sortBy]);
            this.setState({
                userBuffer: buffer
            })
        //sort by distance
        } else if(this.state.sortBy === 'location') {
            buffer = sort(buffer).asc(u => u.distance);
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
                <form style={{ 'marginBottom': '2rem' }}>
                <div className="" style={{ display: 'flex', 'justifyContent': 'space-around' }}>
                    <div className="" style={filterStyle}>
                        <h4>Age</h4>
                        <p>from {this.state.value[0]} to {this.state.value[1]}</p>
                        {/* <p>from {this.state.rangeAgeFrom} years old</p>
                        <input type="range" className="custom-range" id="rangeAgeFrom" name="rangeAgeFrom" min="18" max="79" value={this.state.rangeAgeFrom} onChange={this.onChange} />
                        <p>to {this.state.rangeAgeTo} years old</p>
                        <input type="range" className="custom-range" id="rangeAgeTo" name="rangeAgeTo" min="19" max="80" value={this.state.rangeAgeTo} onChange={this.onChange} /> */}
                        <Range allowCross={false} value={this.state.value} onChange={this.onSliderChange} />

                        <h4>Fame</h4>
                        <p>search users above {this.state.rangeFame} Fame</p>
                        <input type="range" className="custom-range" id="rangeFame" name="rangeFame" min="0" max="100" value={this.state.rangeFame} onChange={this.onChange} />
                    </div>
                    <div className="" style={filterStyle}>
                        <h4>Localisation</h4>
                        <p>search users {this.state.rangeLocalisation}km{`${this.state.rangeLocalisation > 1 ? 's' : ''}`} from you</p>
                        <input type="range" className="custom-range" id="rangeLocalisation" name="rangeLocalisation" min="1" max="10000" value={this.state.rangeLocalisation} onChange={this.onChange} />
                        <h4>Interests</h4>
                            <Select
                                isMulti
                                isSearchable
                                placeholder="Filter interests"
                                value={this.state.selectedOption}
                                onChange={this.handleSelectChange}
                                options={this.state.interestsArray}
                            />
                    </div>
                </div>
                <div style={{ padding: '2rem'}}>
                    <div style={{backgroundColor: 'grey', height: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}> <h4>SORT BY</h4></div>
                    <div style={{backgroundColor: 'grey', height: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={somemargin}>
                            <div>Age</div>
                            <input type="radio" name="sortBy" value="age" checked={this.state.sortBy === 'age'} onChange={this.onChange}/>
                        </div>
                        <div style={somemargin}>
                            <div>Distance</div>
                            <input type="radio" name="sortBy" value="location" checked={this.state.sortBy === 'location'} onChange={this.onChange}/>
                        </div>
                        <div style={somemargin}>
                            <div>Tags</div>
                            <input type="radio" name="sortBy" value="tags" checked={this.state.sortBy === 'tags'} onChange={this.onChange}/>
                        </div>
                        <div style={somemargin}>
                            <div>Fame</div>
                            <input type="radio" name="sortBy" value="fame" checked={this.state.sortBy === 'fame'} onChange={this.onChange}/>
                        </div>
                    </div>
                    
                </div>
            </form>
            <ResultUser users={filteredUsers}/>
            </div>
            
        )
    }
}

const somemargin = { textAlign: 'center', width: '24%'}

const filterStyle = {
    width: '45%',
    float: 'left',
    padding: '1rem',
    'backgroundColor': 'lightgray',
    'marginTop': '2rem'
};

const state = (state, ownProps = {}) => {
    return {
        getUserInterests: state.getUserInterests.getUserInterests
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateTo: (location) => {
            dispatch(push(location));
        },
        onGetUserIntrests: (userId) => dispatch(GetUserIntrests(userId))
    }
};

export default connect(
    state,
    mapDispatchToProps
)(SuggestionList);
