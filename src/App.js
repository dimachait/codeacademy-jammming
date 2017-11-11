import React, { Component } from 'react';
import './App.css';
import { SearchBar } from './SearchBar/SearchBar.js';
import { SearchResults } from './SearchResults/SearchResults.js';
import { PlayList } from './PlayList/PlayList.js';
import { Spotify } from './util/Spotify.js';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playList: [],
            playListTitle: 'New Playlist'
        }
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlayListTitle = this.updatePlayListTitle.bind(this);
        this.searchSpotify = this.searchSpotify.bind(this);
        this.savePlayList = this.savePlayList.bind(this);
        this.loadPlayList = this.loadPlayList.bind(this);
    }

    addTrack(track) {
        let newPlaylist = this.state.playList;
        if (!newPlaylist.some(element => element.id === track.id)) {
            newPlaylist.push(track);
            this.setState({playList: newPlaylist});
        }
    }

    removeTrack(track) {
        let newPlaylist = this.state.playList;
        newPlaylist.splice(newPlaylist.indexOf(track), 1);
        this.setState({playList: newPlaylist});
    }

    updatePlayListTitle(newTitle) {
        this.setState({playListTitle: newTitle});
    }

    searchSpotify(term) {
        Spotify.search(term).then(tracks => {
            this.setState({searchResults: tracks});
        });
    }

    loadPlayList() {
        Spotify.loadPlayList(this.state.playListTitle).then(tracks => {
            if (tracks) {
                this.setState({playList: tracks});
            }
        });
    }

    savePlayList() {
        Spotify.savePlayList(this.state.playListTitle, this.state.playList).then(response => {
            this.setState({
                playList: [],
                playListTitle: 'New Playlist'
            });
        });
    }

    render() {
        return (
          <div className="App">
              <SearchBar searchSpotify={this.searchSpotify}/>
              <div className="App-playlist">
                <SearchResults tracks={this.state.searchResults} onClick={this.addTrack}/>
                <PlayList title={this.state.playListTitle} onChange={this.updatePlayListTitle} tracks={this.state.playList} onClick={this.removeTrack} savePlayList={this.savePlayList} loadPlayList={this.loadPlayList}/>
              </div>
          </div>
        );
    }
}

export default App;
