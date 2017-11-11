import React from 'react';
import './Track.css';
export class Track extends React.Component {

    handleClick(title, artist, album) {
        this.props.onClick(title, artist, album);
    }

    render() {
        return(
            <div className="Track">
              <div className="Track-information">
                <h3>{this.props.track.title}</h3>
                <p>{this.props.track.artist} | {this.props.track.album}</p>
                <h4>({this.props.track.duration})</h4>
              </div>
              {
                  this.props.track.sampleUrl && (<audio controls className="Track-audio">
                    <source src={this.props.track.sampleUrl} type="audio/mpeg" />
                  </audio>)
              }
              <a className="Track-action" onClick={this.handleClick.bind(this,this.props.track)}>{this.props.actionSign}</a>
            </div>
        )
    }

}
