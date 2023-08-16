import React, { Component } from "react";
import styles from "./ToolbarComponent.css";

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
    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.sendSignal = this.sendSignal.bind(this);
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

  openSidebar() {
    this.props.openSidebar();
  }

  closeSidebar() {
    this.props.closeSidebar();
  }

  sendSignal(data, page) {
    this.props.sendSignal(data, page);
  }

  render() {
    const isOpen = this.props.isOpen;
    const clazz = this.props.clazz;
    const localUser = this.props.user;
    const trace = this.props.trace;
    const words = this.props.words;
    const pages = this.props.pages;

    return (
      <>
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <div id="navSessionInfo" className={styles.verticalText}>
            {/* ${mySessionId}  */}
            {this.props.sessionId &&
              [...`${clazz.className}`].map((char, index) => (
                <div key={index} className={styles.charContainer}>
                  <span className={styles.character}>{char}</span>
                </div>
              ))}
          </div>

          {isOpen &&
            pages.map((page, i) => (
              <button
                key={i}
                onClick={() => {
                  if (window.confirm(`${page.name} 페이지로 이동하시겠습니까?`))
                    this.sendSignal({ page: page.path }, "page");
                }}
              >
                {page.name}
              </button>
            ))}
          {isOpen &&
            words.map((word, i) => (
              <button
                key={i}
                onClick={() => {
                  this.sendSignal({ word: word }, "word");
                }}
              >
                {word.word}
              </button>
            ))}

          <div className="buttonsContent">
            <IconButton
              style={{ color: "#4070e9" }}
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
              style={{ color: "#4070e9" }}
              className="navButton"
              id="navMouseButton"
              onClick={this.traceStatusChanged}
            >
              {!trace ? <Mouse /> : <Close color="secondary" />}
            </IconButton>

            <IconButton
              style={{ color: "rgb(255, 5, 5)" }}
              className="navButton"
              onClick={this.leaveSession}
              id="navLeaveButton"
            >
              <PowerSettingsNew />
            </IconButton>
          </div>
        </div>
      </>
    );
  }
}
