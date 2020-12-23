import React, { Component } from 'react'

export class SuggestionAlert extends Component {
    render() {
        return (
            <div>
                <div className="alert alert-warning" role="alert">
                   <i></i> {this.props.message} <a href={this.props.link}>here</a>
                </div>
            </div>
        )
    }
}

export default SuggestionAlert
