import React, { Component } from "react";
import styles from "./ToolbarComponent.css";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import Mic from "@mui/icons-material/Mic";
import MicOff from "@mui/icons-material/MicOff";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import Mouse from "@mui/icons-material/Mouse";
import Close from "@mui/icons-material/Close";

import IconButton from "@mui/material/IconButton";

export default class ToolbarComponent extends Component {
  constructor(props) {
    super(props);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.traceStatusChanged = this.traceStatusChanged.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
  }

  micStatusChanged() {
    this.props.micStatusChanged();
  }

  traceStatusChanged() {
    this.props.traceStatusChanged();
  }

  leaveSession() {
    this.props.leaveSession();
  }

  render() {
    const mySessionId = this.props.sessionId;
    const clazz = this.props.clazz;
    const localUser = this.props.user;
    const trace = this.props.trace;

    return (
      <AppBar className="toolbar" id="header">
        <Toolbar className="toolbar">
          <div id="navSessionInfo">
            {this.props.sessionId && (
              <div id="titleContent">
                <span id="session-title" className={styles.sessiontt}>
                  {mySessionId} - {clazz.className}
                </span>
              </div>
            )}
          </div>

          <div className="buttonsContent">
            <IconButton
              color="inherit"
              className="navButton"
              id="navMicButton"
              onClick={this.micStatusChanged}
            >
              {localUser !== undefined && localUser.isAudioActive() ? (
                <Mic />
              ) : (
                <MicOff color="secondary" />
              )}
            </IconButton>

            <IconButton
              color="inherit"
              className="navButton"
              id="navMouseButton"
              onClick={this.traceStatusChanged}
            >
              {!trace ? <Mouse /> : <Close color="secondary" />}
            </IconButton>

            <IconButton
              color="secondary"
              className="navButton"
              onClick={this.leaveSession}
              id="navLeaveButton"
            >
              <PowerSettingsNew />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}
