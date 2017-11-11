import React from 'react';
import './PlayList.css';
import { TrackList } from '../TrackList/TrackList.js';

export class PlayList extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event.target.value);
    }


    handleLoad(event) {
        this.props.loadPlayList();
    }

    handleSave(event) {
        this.props.savePlayList();
    }

    render() {
        return(
            <div className="Playlist">
              <input value={this.props.title} onChange={this.handleChange}/>
              <TrackList tracks={this.props.tracks} onClick={this.props.onClick} actionSign='-'/>
              <a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a>
              <a className="Playlist-load" onClick={this.handleLoad}>LOAD FROM SPOTIFY</a>
            </div>
        )
    }

}
