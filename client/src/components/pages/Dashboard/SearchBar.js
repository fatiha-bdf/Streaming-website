import React, { Component } from 'react'
import Select from 'react-select';
import { GetUserIntrests } from '../../../store/actions/intrestsActions/GetAllInterestsAction';
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Slider from 'rc-slider';
import { fetchAllUsersPublicData } from '../../../store/actions/UsersActions/fetchAllUsersPublicDataAction';
import { getUserLocation } from '../../../store/actions/UsersActions/GetUserLocationAction';

const Range = Slider.Range;

export class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lowerBound: 20,
            upperBound: 40,
            value: [20, 40],
            SearchBar: '',
            rangeFame: 0,
            rangeLocalisation: 20,
            SearchBarTags: '',
            interestsArray: [],
            selectedOption: [],
            location: ""
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
    onSliderChange = (value) => {
        this.setState({
            value,
        });
    }
    handleApply = () => {
        const { lowerBound, upperBound } = this.state;
        this.setState({ value: [lowerBound, upperBound] });
    }

    async UNSAFE_componentWillMount() {
        const userId = localStorage.getItem("userId");
        await this.props.onGetUserIntrests(userId);
        await this.props.onGetUserLocation();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.getUserInterests !== undefined && nextProps.getUserInterests.code === 200)
            this.initInterestArray(nextProps.getUserInterests.data)
        if (this.state.location === "" && nextProps.locateUser !== ""){
            this.setState({
                location: nextProps.locateUser 
                })
        }
    }

    handleSelectChange = selectedOption => {
        this.setState(
            { selectedOption },
        );
    };

    initInterestArray(interests) {
        this.setState({
            interestsArray: interests
        })
    }

    onChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        // const {valuesearchBar, valuerangeAgeFrom, valuerangeAgeTo, valuerangeFame, valuerangeLocalisation } = this.state;
        return (
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
                        <hr></hr>
                        <span className="input-group-btn">
                            <button onClick={(e) => { this.handleUsersFilter(e) }} type="Search" className="btn btn-primary btn-block">Search</button>
                        </span>
                    </div>
                    <div className="" style={filterStyle}>
                        <h4>Localisation</h4>
                        <p>search users {this.state.rangeLocalisation}km{`${this.state.rangeLocalisation > 1 ? 's' : ''}`} from you</p>
                        <input type="range" className="custom-range" id="rangeLocalisation" name="rangeLocalisation" min="1" max="20000" value={this.state.rangeLocalisation} onChange={this.onChange} />
                        <h4>Select Interests</h4>
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
            </form>
        )
    }
}

const filterStyle = {
    width: '45%',
    float: 'left',
    padding: '1rem',
    'backgroundColor': 'lightgray',
    'marginTop': '2rem'
};


const state = (state, ownProps = {}) => {
    return {
        fetchAllUsersPublicData: state.fetchAllUsersPublicData.fetchAllUsersPublicData,
        getUserInterests: state.getUserInterests.getUserInterests,
        location: state.location,
        locateUser: state.locateUser.locateUser,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateTo: (location) => {
            dispatch(push(location));
        },
        onGetUserIntrests: (userId) => dispatch(GetUserIntrests(userId)),
        onfetchAllUsersPublicData: (filter) => dispatch(fetchAllUsersPublicData(filter)),
        onGetUserLocation: () => dispatch(getUserLocation())
    }
};

export default connect(
    state,
    mapDispatchToProps
)(SearchBar);