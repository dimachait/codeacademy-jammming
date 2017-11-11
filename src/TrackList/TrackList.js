import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track.js';

export class TrackList extends React.Component {

    render() {
        let actionSign = this.props.actionSign;
        let onClick = this.props.onClick;

        return(
            <div className="TrackList">
                {this.props.tracks ? this.props.tracks.map(function(track,index,tracks) {
                    return <Track key={track.id} track={track} onClick={onClick} actionSign={actionSign}/>
                }) : false }
            </div>
        )
    }

}
