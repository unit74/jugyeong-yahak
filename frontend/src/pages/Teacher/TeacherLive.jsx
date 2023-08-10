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
      mic: true,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.updateMousePosition = this.updateMousePosition.bind(this);
    this.handlePageMove = this.handlePageMove.bind(this);
  }

  componentDidMount() {
    this.login(); // 일단 여기서 임시로 로그인
    this.joinSession();
    window.addEventListener("mousemove", this.updateMousePosition);
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
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

        this.getToken().then((token) => {
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(async () => {
              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: "640x480",
                frameRate: 30,
                insertMode: "APPEND",
                mirror: false,
              });

              mySession.publish(publisher);

              this.setState(
                {
                  mainStreamManager: publisher,
                  publisher: publisher,
                },
                () => {
                  this.handleConnect();
                }
              );
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
      trace: false,
      mouse: { x: null, y: null },
      mic: true,
    });
  }

  handleConnect() {
    const eventSourceInitDict = {
      heartbeatTimeout: 60000 * 60, // 타임아웃을 60분으로 설정
    };

    const sse = new EventSourcePolyfill(
      `${BASE_URL}/sse/v1/subscribe?streamId=${this.state.publisher.stream.connection.connectionId}&classId=${this.state.mySessionId}`,
      eventSourceInitDict
    );

    sse.addEventListener("connect", (e) => {
      const { data: receivedConnectData } = e;
      console.log("Connected! ", receivedConnectData);
    });

    sse.addEventListener("page", (e) => {
      const { data: receivedPageNo } = e;
      this.handlePageMove(receivedPageNo);
    });

    sse.addEventListener("mic", (e) => {
      const { data: receivedMicStatus } = e;
      this.setState({
        mic: receivedMicStatus,
      });
    });

    sse.addEventListener("mouse", (e) => {
      const { data: receivedMousePointer } = e;
      this.setState({
        mouse: JSON.parse(receivedMousePointer),
      });
    });

    alert(`Connected`);
  }

  updateMousePosition(e) {
    this.handleMousePointerRequest(e.clientX, e.clientY);
  }

  handlePageMove(page) {
    if (page === "1") this.state.navigate("/teacher-live");
    else if (page === "2") this.state.navigate("/teacher-live/about");
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
                <div>교사 : {myUserName}님</div>
                <UserVideoComponent streamManager={this.state.mainStreamManager} />
              </div>
            ) : null}
            <div id="video-container" className="col-md-6">
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
          <button onClick={() => this.handlePageMoveRequest(1)}>
            Home 페이지로 이동 변경 요청
          </button>
          <button onClick={() => this.handlePageMoveRequest(2)}>
            About 페이지로 이동 변경 요청
          </button>
          {/* 페이지 변경 끝 */}

          {/* 마우스 트레킹 시작 */}
          <div>
            <label>마우스 트레이싱 : </label>
            <input
              type="checkbox"
              onChange={(e) => {
                this.setState({
                  trace: e.target.checked,
                });
              }}
            />
          </div>
          {/* 마우스 트레킹 끝 */}
        </div>
        <hr></hr>
        <div>
          <h1>실시간 정보들</h1>
          <div>
            Mouse : {this.state.mouse.x} {this.state.mouse.y}
          </div>
          <div>
            Mic : <input type="checkbox" disabled={true} checked={this.state.mic === "true"} />
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

  async handlePageMoveRequest(pageNo) {
    await axios
      .post(
        `${BASE_URL}/api/v1/private/lecture/convert/page`,
        {
          classId: this.state.mySessionId,
          streamId: this.state.publisher.stream.connection.connectionId,
          number: pageNo,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      )
      .then(function (response) {})
      .catch(function (error) {
        console.log("error", error);
      });
  }

  async handleMicControlRequest(target, status) {
    await axios
      .post(
        `${BASE_URL}/api/v1/private/lecture/mic/control`,
        {
          classId: this.state.mySessionId,
          streamId: target,
          status: status,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      )
      .then(function (response) {})
      .catch(function (error) {
        console.log("error", error);
      });
  }

  async handleMousePointerRequest(x, y) {
    if (!this.state.trace) {
      return;
    }

    await axios
      .post(
        `${BASE_URL}/api/v1/private/lecture/mouse/pointer`,
        {
          classId: this.state.mySessionId,
          streamId: this.state.publisher.stream.connection.connectionId,
          x: x,
          y: y,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      )
      .then(function (response) {})
      .catch(function (error) {
        console.log("error", error);
      });
  }
}

export default TeacherLive;
