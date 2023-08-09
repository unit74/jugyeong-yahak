import styles from "./StudentLive.module.css";

import { OpenVidu } from "openvidu-browser";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { EventSourcePolyfill } from "event-source-polyfill";

import axios from "axios";
import React, { Component } from "react";
// import "./TeacherLive.module.css";
import UserVideoComponent from "../../components/UserVideoComponent";
import About from "../Common/About";
import Home from "../Common/Home";

const BASE_URL = "https://i9e206.p.ssafy.io";

export default function StudentLive() {
  const navigate = useNavigate();

  const state = {
    clazz: {
      no: 1,
      name: "새싹반",
    },
    userName: "학생" + Math.floor(Math.random() * 100),
  };

  // 태그 생성부분
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.time}></div>
        <OpenViduSession state={state} navigate={navigate} />
      </div>
    </div>
  );
}

class OpenViduSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigate: props.navigate,
      clazz: props.state.clazz,
      mySessionId: props.state.clazz.no,
      myUserName: props.state.userName,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      trace: false,
      mouse: { x: null, y: null },
      mic: true,
      theme: null,
      word: null,
      choseong: null,
      page: -1,
      count: -1,
      mutes: [],
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
  }

  componentDidMount() {
    this.joinSession();
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession() {
    this.OV = new OpenVidu();

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        mySession.on("streamCreated", (event) => {
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscriber.publishAudio = true;
          subscribers.push(subscriber);

          this.setState({
            subscribers: subscribers,
          });
        });

        mySession.on("streamDestroyed", (event) => {
          this.deleteSubscriber(event.stream.streamManager);
        });

        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        this.subscribeToMicControl();
        this.subscribeToInit();
        this.subscribeToMouse();

        this.getToken().then((token) => {
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(async () => {
              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: this.state.mic,
                publishVideo: true,
                resolution: "640x480",
                frameRate: 30,
                insertMode: "APPEND",
                mirror: false,
              });

              mySession.publish(publisher);

              this.setState({
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  leaveSession() {
    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    this.OV = null;
    this.setState({
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      mouse: { x: null, y: null },
      mic: true,
      theme: null,
      word: null,
      page: -1,
      count: -1,
      mutes: [],
    });
  }

  micStatusChanged() {
    const publisher = this.state.publisher;
    publisher.isAudioActive = this.state.mic;
    this.sendSignalUserChanged({ isAudioActive: this.state.mic });
    this.setState({ publisher: publisher });
  }

  subscribeToMicControl() {
    this.state.session.on("signal:mic", (event) => {
      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.stream.connection.connectionId === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log("EVENTO REMOTE: ", event.data);
          if (data.isAudioActive !== undefined) {
            user.publishAudio = data.isAudioActive;
          }
        }
      });
      this.setState({
        subscribers: remoteUsers,
      });
    });
  }

  subscribeToInit() {
    this.state.session.on("signal:init", (event) => {
      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.stream.connection.connectionId === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log("EVENTO REMOTE: ", event.data);

          this.handleMainVideoStream(user);
        }
      });
      this.setState({
        subscribers: remoteUsers,
      });
    });
  }

  subscribeToMouse() {
    this.state.session.on("signal:mouse", (event) => {
      const data = JSON.parse(event.data);
      console.log("EVENTO REMOTE: ", event.data);

      this.setState({
        mouse: data,
      });
    });
  }

  subscribeToPage() {
    this.state.session.on("signal:page", (event) => {
      const data = JSON.parse(event.data);
      console.log("EVENTO REMOTE: ", event.data);

      this.setState({
        page: data.page,
      });
    });
  }

  handlePageMove() {
    if (this.state.page === "0") this.state.navigate("/student-live");
    else if (this.state.page === "1") this.state.navigate("/student-live/about");
  }

  render() {
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;
    const clazz = this.state.clazz;

    return (
      <div className="container">
        <h1>{clazz.name} 라이브 중입니다.</h1>
        {this.state.session !== undefined ? (
          <div id="session">
            {this.state.mainStreamManager !== undefined ? (
              <div
                id="main-video"
                style={{
                  display: "inline-block",
                  width: "200px",
                  height: "200px",
                }}
              >
                <div>교사</div>
                <UserVideoComponent streamManager={this.state.mainStreamManager} />
              </div>
            ) : null}
            <div id="video-container" className="col-md-6">
              {this.state.publisher !== undefined ? (
                <div
                  className="stream-container"
                  style={{
                    display: "inline-block",
                    width: "200px",
                    height: "200px",
                  }}
                >
                  <div>{myUserName}님</div>
                  <div>
                    Mic :
                    <input type="checkbox" disabled={true} checked={this.state.mic} />
                  </div>
                  <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null}
              {this.state.subscribers
                .filter(
                  (sub) =>
                    !this.state.mainStreamManager ||
                    (this.state.mainStreamManager &&
                      this.state.mainStreamManager.stream.connection.connectionId !==
                        sub.stream.connection.connectionId)
                )
                .map((sub, i) => (
                  <div
                    key={sub.id}
                    style={{
                      display: "inline-block",
                      width: "200px",
                      height: "200px",
                    }}
                    className="stream-container"
                  >
                    <input type="checkbox" disabled={true} checked={sub.publishAudio} />
                    <span>{sub.id}</span>
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
            </div>
          </div>
        ) : null}

        <hr></hr>
        <div>
          <h1>실시간 정보들</h1>
          <div>
            Mouse : {this.state.mouse.x} {this.state.mouse.y}
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
          {this.state.mouse.x !== null && this.state.mouse.y != null && (
            <div
              style={{
                position: "absolute",
                left: `${this.state.mouse.x}px`,
                top: `${this.state.mouse.y}px`,
                height: "20px",
                width: "20px",
                borderRadius: "50%",
                backgroundColor: "red",
              }}
            />
          )}
        </div>
      </div>
    );
  }

  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  }

  async createSession(sessionId) {
    const response = await axios.post(
      BASE_URL + "/api/v1/openvidu/sessions",
      { customSessionId: sessionId + "" },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }

  async createToken(sessionId) {
    const response = await axios.post(
      BASE_URL + "/api/v1/openvidu/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }
}
