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
      <div className="sidebar">
        <div id="navSessionInfo" className={styles.verticalText}>
          {/* ${mySessionId}  */}
          {this.props.sessionId &&
            [...`${clazz.className}`].map((char, index) => (
              <div key={index} className={styles.charContainer}>
                <span className={styles.character}>{char}</span>
              </div>
            ))}
        </div>

        <div className="buttonsContent">
          <IconButton
            style={{ color: '#4070e9' }}
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
            style={{ color: '#4070e9' }}
            className="navButton"
            id="navMouseButton"
            onClick={this.traceStatusChanged}
          >
            {!trace ? <Mouse /> : <Close color="secondary" />}
          </IconButton>

          <IconButton
            style={{ color: 'rgb(255, 5, 5)' }}
            className="navButton"
            onClick={this.leaveSession}
            id="navLeaveButton"
          >
            <PowerSettingsNew />
          </IconButton>
        </div>
      </div>

    );
  }
}
