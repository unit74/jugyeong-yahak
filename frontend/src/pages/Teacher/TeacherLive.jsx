import { OpenVidu } from "openvidu-browser";
import { Route, Routes } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { EventSourcePolyfill } from "event-source-polyfill";

import axios from "axios";
import React, { Component } from "react";
// import "./TeacherLive.module.css";
import UserVideoComponent from "../../components/UserVideoComponent";
import About from "../Common/About";
import Home from "../Common/Home";

const BASE_URL = "https://i9e206.p.ssafy.io";

function TeacherLive() {
  const location = useLocation();
  const navigate = useNavigate();
  return <OpenViduSession state={location.state} navigate={navigate} />;
}

class OpenViduSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigate: props.navigate,
      clazz: props.state.clazz,
      mySessionId: props.state.clazz.no,
      myUserName: "교사 이름",
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      trace: false,
      mouse: { x: null, y: null },
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
    this.updateMousePosition = this.updateMousePosition.bind(this);
    this.sendSignalMouse = this.sendSignalMouse.bind(this);
    this.handleMouseTraceOn = this.handleMouseTraceOn.bind(this);
    this.handleMouseTraceOff = this.handleMouseTraceOff.bind(this);
  }

  componentDidMount() {
    this.login(); // 일단 여기서 임시로 로그인
    this.joinSession();
    window.addEventListener("mousedown", this.handleMouseTraceOn);
    window.addEventListener("mouseup", this.handleMouseTraceOff);
    window.addEventListener("mousemove", this.updateMousePosition);
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleMouseTraceOn);
    window.removeEventListener("mouseup", this.handleMouseTraceOff);
    window.removeEventListener("mousemove", this.updateMousePosition);
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

          this.sendSignalInit({}); // 페이지 정보나 이런거 일단 보낼듯?

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
        this.subscribeToPage();

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
    this.setState({});
  }

  sendSignal(data, type) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: type,
    };
    this.state.session.signal(signalOptions);
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

  subscribeToPage() {
    this.state.session.on("signal:page", (event) => {
      const data = JSON.parse(event.data);
      console.log("EVENTO REMOTE: ", event.data);

      this.setState({
        page: data.page,
      });
    });
  }

  handleMouseTraceOn() {
    this.setState({
      trace: true,
    });
  }

  handleMouseTraceOff() {
    this.setState(
      {
        trace: false,
      },
      () => {
        const data = {
          x: null,
          y: null,
        };
        const type = "mouse";

        this.sendSignal(data, type);
      }
    );
  }

  updateMousePosition(e) {
    if (!this.state.trace) return;

    const data = {
      x: e.clientX,
      y: e.clientY,
    };
    const type = "mouse";

    this.sendSignal(data, type);
  }

  updatePage(page) {
    this.setState(
      {
        page: page,
      },
      () => {
        const data = {
          page: this.state.page,
        };
        const type = "page";

        this.sendSignal(data, type);
      }
    );
  }

  handlePageMove() {
    if (this.state.page === "0") this.state.navigate("/teacher-live");
    else if (this.state.page === "1") this.state.navigate("/teacher-live/about");
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
                  <div>교사 : {myUserName}님</div>
                  <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null}
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={sub.id}
                  style={{
                    display: "inline-block",
                    width: "200px",
                    height: "200px",
                  }}
                  className="stream-container"
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <input
                    type="checkbox"
                    checked={sub.publishAudio}
                    onChange={(e) => {
                      this.handleMicControlRequest(
                        sub.stream.connection.connectionId,
                        e.target.checked
                      );
                    }}
                  />
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <hr></hr>
        <div>
          {/* 페이지 변경 시작 */}
          <button onClick={() => this.updatePage(0)}>Home 페이지로 이동 변경 요청</button>
          <button onClick={() => this.updatePage(1)}>About 페이지로 이동 변경 요청</button>
          {/* 페이지 변경 끝 */}
        </div>
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
        </div>
      </div>
    );
  }

  async login() {
    await axios
      .post(`${BASE_URL}/api/v1/auth/governments/login`, {
        // 지자체 로그인으로 우선 테스트
        identification: "string", // 아이디 비밀번호가 실제로 string/string임..
        password: "string",
      })
      .then(function (response) {
        const data = response.data.data;

        localStorage.setItem("token", data.token);
      })
      .catch(function (error) {
        console.error(error);
      });
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

export default TeacherLive;
