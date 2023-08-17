import React, { Component } from 'react';
import './StreamComponent.css';
import OvVideoComponent from './OvVideo';

import MicOff from '@mui/icons-material/MicOff';

export default class StreamComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: this.props.user.getNickname(),
    };
  }

  render() {
    return (
      <div className='container'>
        <div className='pointer nickname'>
          <span
            style={{
              background: 'rgba(58, 64, 74, 0.651)',
              position: 'absolute',
              zIndex: 999,
              color: '#ffffff',
            }}
            id='nickname'
          >
            {this.props.user.getNickname()}
          </span>
        </div>
        {this.props.user !== undefined && this.props.user.getStreamManager() !== undefined ? (
          <div className='streamComponent'>
            <OvVideoComponent user={this.props.user} />
            <div id='statusIcons'>
              {!this.props.user.isAudioActive() ? (
                <div id='micIcon'>
                  <MicOff id='statusMic' />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
