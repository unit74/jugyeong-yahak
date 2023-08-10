import React, { Component } from 'react';
import './ToolbarComponent.css';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Mic from '@mui/icons-material/Mic';
import MicOff from '@mui/icons-material/MicOff';
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew';

import IconButton from '@mui/material/IconButton';

export default class ToolbarComponent extends Component {
  constructor(props) {
    super(props);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
  }

  micStatusChanged() {
    this.props.micStatusChanged();
  }

  leaveSession() {
    this.props.leaveSession();
  }

  render() {
    const mySessionId = this.props.sessionId;
    const clazz = this.props.clazz;
    const localUser = this.props.user;
    return (
      <AppBar className='toolbar' id='header'>
        <Toolbar className='toolbar'>
          <div id='navSessionInfo'>
            {this.props.sessionId && (
              <div id='titleContent'>
                <span id='session-title'>
                  {mySessionId} - {clazz.name}
                </span>
              </div>
            )}
          </div>

          <div className='buttonsContent'>
            <IconButton
              color='inherit'
              className='navButton'
              id='navMicButton'
              onClick={this.micStatusChanged}
            >
              {localUser !== undefined && localUser.isAudioActive() ? (
                <Mic />
              ) : (
                <MicOff color='secondary' />
              )}
            </IconButton>
            <IconButton
              color='secondary'
              className='navButton'
              onClick={this.leaveSession}
              id='navLeaveButton'
            >
              <PowerSettingsNew />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}
