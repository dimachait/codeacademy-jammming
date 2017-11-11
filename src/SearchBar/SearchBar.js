import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            term: ''
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleTermChange(event) {
        this.setState({
            term: event.target.value
        });
    }

    handleKeyPress(event) {
        if (this.state.term) {
            if (event.key === 'Enter') {
                this.props.searchSpotify(this.state.term);
            }
        }
    }

    handleSearch(event) {
        this.props.searchSpotify(this.state.term);
        event.preventDefault();
    }

    render() {
        return(
          <div className="SearchBar" onKeyPress={this.handleKeyPress}>
            <input placeholder="Enter A Song, Album, or Artist" value={this.state.term} onChange={this.handleTermChange}/>
            <a onClick={this.handleSearch}>SEARCH</a>
          </div>
        )
    }

}
