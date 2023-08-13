import { OpenVidu } from "openvidu-browser";
import { Route, Routes } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "../Common/api/authAxios";
import React, { Component } from "react";
import "./TeacherLive.module.css";
import StreamComponent from "../../components/StreamComponent";
import ToolbarComponent from "../../components/ToolbarComponent";
import UserModel from "../../models/user-model";

import Mic from "@mui/icons-material/Mic";
import MicOff from "@mui/icons-material/MicOff";
import IconButton from "@mui/material/IconButton";
import Scrollbars from "react-custom-scrollbars-2";

import TeacherTheme from "./TeacherTheme";
import styles from "./TeacherLive.module.css";
import TeacherCurriculum from "./TeacherCurriculum";
import TeacherLiveWord from "./TeacherLiveWord";
import TeacherLiveSituation from "./TeacherLiveSituation";
import TeacherLiveReadWord from "./TeacherLiveReadWord";
import TeacherLiveReadWordHint from "./TeacherLiveReadWordHint";
import TeacherLiveWrite from "./TeacherLiveWrite";
import TeacherLiveWriteHint from "./TeacherLiveWriteHint";

var localUser = new UserModel();
const BASE_URL = "https://i9e206.p.ssafy.io";

export default function TeacherLive() {
  const location = useLocation();
  const navigate = useNavigate();
  return <OpenViduSession clazz={location.state.clazz} navigate={navigate} />;
}

class OpenViduSession extends Component {
  constructor(props) {
    super(props);
    this.navigate = props.navigate;
    this.clazz = props.clazz;
    this.mySessionId = props.clazz.id;
    this.myUserName = localStorage.getItem("userInfo").name;
    this.remotes = [];

    this.state = {
      mainStreamUser: undefined,
      session: undefined,
      localUser: undefined,
      subscribers: [],
      trace: false,
      page: 0,
      theme: null,
      curriculum: null,
      word: null,
      choseong: null,
      timer: 0,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.traceStatusChanged = this.traceStatusChanged.bind(this);
    this.updateMousePosition = this.updateMousePosition.bind(this);
    this.subscribeToUserChanged = this.subscribeToUserChanged.bind(this);
    this.deleteSubscriber = this.deleteSubscriber.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.connectWebCam = this.connectWebCam.bind(this);
    this.subscribeToTimer = this.subscribeToTimer.bind(this);
  }

  componentDidMount() {
    window.addEventListener("mousemove", this.updateMousePosition);
    window.addEventListener("beforeunload", this.onbeforeunload);
    this.joinSession();
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.updateMousePosition);
    window.removeEventListener("beforeunload", this.onbeforeunload);
    this.leaveSession();
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  joinSession() {
    this.OV = new OpenVidu();

    this.setState(
      {
        session: this.OV.initSession(),
      },
      async () => {
        this.subscribeToStreamCreated();
        await this.connectToSession();
      }
    );
  }

  async connectToSession() {
    try {
      var token = await this.getToken();
      console.log("Token : " + token);
      this.connect(token);
    } catch (error) {
      console.error(
        "There was an error getting the token:",
        error.code,
        error.message
      );
      if (this.props.error) {
        this.props.error({
          error: error.error,
          messgae: error.message,
          code: error.code,
          status: error.status,
        });
      }
      alert("There was an error getting the token:", error.message);
      this.navigate("/teacher-main");
    }
  }

  connect(token) {
    this.state.session
      .connect(token, { clientData: this.myUserName })
      .then(() => {
        this.connectWebCam();
      })
      .catch((error) => {
        if (this.props.error) {
          this.props.error({
            error: error.error,
            messgae: error.message,
            code: error.code,
            status: error.status,
          });
        }
        alert("There was an error connecting to the session:", error.message);
        console.log(
          "There was an error connecting to the session:",
          error.code,
          error.message
        );
      });
  }

  async connectWebCam() {
    let publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: localUser.isAudioActive(),
      publishVideo: true,
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

    this.state.session.publish(publisher).then(() => {
      this.updateSubscribers();
    });

    localUser.setNickname(this.myUserName);
    localUser.setConnectionId(this.state.session.connection.connectionId);
    localUser.setStreamManager(publisher);

    this.subscribeToUserChanged();
    this.subscribeToStreamDestroyed();
    this.subscribeToMic();
    this.subscribeToExit();
    this.subscribeToTimer();

    this.setState({
      mainStreamUser: localUser,
      localUser: localUser,
    });
  }

  updateSubscribers() {
    var subscribers = this.remotes;
    this.setState(
      {
        subscribers: subscribers,
      },
      () => {
        if (this.state.localUser) {
          this.sendSignalUserChanged({
            isAudioActive: this.state.localUser.isAudioActive(),
            nickname: this.state.localUser.getNickname(),
          });
        }
      }
    );
  }

  async leaveSession() {
    const mySession = this.state.session;

    if (mySession) {
      this.OV = null;
      this.setState(
        {
          mainStreamUser: undefined,
          session: undefined,
          localUser: undefined,
          subscribers: [],
          trace: false,
          page: 0,
          theme: null,
          word: null,
          choseong: null,
          timer: 0,
        },
        async () => {
          await axios
            .delete(`${BASE_URL}/api/v1/private/openvidu`)
            .then(function (response) {
              mySession.disconnect();
            })
            .catch(function (error) {
              console.error(error);
            });
        }
      );
    }
  }

  micStatusChanged() {
    localUser.setAudioActive(!localUser.isAudioActive());
    localUser.getStreamManager().publishAudio(localUser.isAudioActive());
    this.sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
    this.setState({ localUser: localUser });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamUser !== stream) {
      this.setState({
        mainStreamUser: stream,
      });
    }
  }

  deleteSubscriber(stream) {
    const remoteUsers = this.state.subscribers;
    const userStream = remoteUsers.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];
    let index = remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      remoteUsers.splice(index, 1);
      this.setState({
        subscribers: remoteUsers,
      });
    }
  }

  subscribeToStreamCreated() {
    this.state.session.on("streamCreated", (event) => {
      const subscriber = this.state.session.subscribe(event.stream, undefined);

      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      newUser.setType("remote");
      const nickname = event.stream.connection.data.split("%")[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      this.remotes.push(newUser);

      this.updateSubscribers();

      const data = {
        page: this.state.page,
        theme: this.state.theme,
        curriculum: this.state.curriculum,
        word: this.state.word,
        choseong: this.state.choseong,
        timer: this.state.timer,
      };

      this.sendSignalInit(data);
    });
  }

  subscribeToStreamDestroyed() {
    this.state.session.on("streamDestroyed", (event) => {
      this.deleteSubscriber(event.stream);
      event.preventDefault();
    });
  }

  subscribeToUserChanged() {
    this.state.session.on("signal:userChanged", (event) => {
      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log("EVENTO REMOTE: ", event.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
        }
      });

      this.setState({
        subscribers: remoteUsers,
      });
    });
  }

  subscribeToMic() {
    this.state.session.on("signal:mic", (event) => {
      const data = JSON.parse(event.data);

      if (localUser && localUser.getConnectionId() === data.target)
        this.micStatusChanged();
    });
  }

  subscribeToExit() {
    this.state.session.on("signal:exit", (event) => {
      this.leaveSession();
      this.navigate("/teacher-main");
    });
  }

  subscribeToTimer() {
    this.state.session.on("signal:timer", (event) => {
      const data = JSON.parse(event.data);

      this.setState({
        timer: data.timer - 1,
      });
    });
  }

  sendSignalUserChanged(data) {
    this.sendSignal(data, "userChanged");
  }

  sendSignalInit(data) {
    this.sendSignal(data, "init");
  }

  sendSignalMic(data) {
    this.sendSignal(data, "mic");
  }

  sendSignalMouse(data) {
    this.sendSignal(data, "mouse");
  }

  sendSignalExit() {
    this.sendSignal(undefined, "exit");
  }

  sendSignalInfo(data) {
    this.sendSignal(data, "info");
  }

  sendSignalTimer(data) {
    this.sendSignal(data, "timer");
  }

  sendSignal(data, page) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: page,
    };
    this.state.session.signal(signalOptions);
  }

  traceStatusChanged() {
    if (this.state.trace) {
      const data = {
        x: null,
        y: null,
      };

      this.sendSignalMouse(data);
    }

    this.setState({
      trace: !this.state.trace,
    });
  }

  updateMousePosition(e) {
    if (!this.state.trace) return;

    const data = {
      x: e.clientX,
      y: e.clientY,
    };

    this.sendSignalMouse(data);
  }

  async getToken() {
    console.log(this.mySessionId);
    const sessionId = await this.createSession(this.mySessionId);
    return await this.createToken(sessionId);
  }

  async createSession(sessionId) {
    const response = await axios.post(
      BASE_URL + "/api/v1/private/openvidu/sessions",
      { customSessionId: sessionId + "" },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }

  async createToken(sessionId) {
    const response = await axios.post(
      BASE_URL + "/api/v1/private/openvidu/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }

  renderComponent() {
    if (this.state.page === 0) {
      if (this.state.theme === null) {
        return (
          <div>
            <h1>✔ 수업하실 테마를 선택해주세요</h1>
            <TeacherTheme $={this} />
          </div>
        );
      } else {
        return (
          <div>
            <h1>✔ 수업하실 커리큘럼을 선택해주세요</h1>

            <TeacherCurriculum $={this} />
          </div>
        );
      }
    } else if (1 <= this.state.page && this.state.page <= 6) {
      const controls = [
        {
          title: "읽기(단어 띄워주는) 페이지로",
          page: 3,
        },
        {
          title: "읽기(초성 중성 종성 떼서 보여주는) 페이지로",
          page: 4,
        },
        {
          title: "받아쓰기(단어 안보여줌) 페이지로",
          page: 5,
        },
        {
          title: "받아쓰기(단어 보여줌) 페이지로",
          page: 6,
        },
      ];

      return (
        <div className={styles.container2}>
          <h1>✔ 수업을 진행해 주세요</h1>
          <h2 className={styles.wordname}>
            {this.state.theme} - {this.state.curriculum.situation}
          </h2>
          <TeacherLiveWord $={this} />
          {this.state.word && (
            <div>
              {controls.map((control, i) => (
                <button
                  onClick={() => {
                    this.setState(
                      {
                        page: control.page,
                      },
                      () => {
                        this.sendSignalInfo({
                          page: this.state.page,
                          word: this.state.word,
                        });
                      }
                    );
                  }}
                >
                  {control.title}
                </button>
              ))}
              <div className={styles.pageButtons}>
                {this.state.page === 2 && (
                  <TeacherLiveSituation
                    img={this.state.curriculum.themeImageUrl}
                    situation={this.state.curriculum.situation}
                    situationJournal={this.state.curriculum.situationJournal}
                  />
                )}
                {this.state.page === 3 && (
                  <TeacherLiveReadWord word={this.state.word} />
                )}
                {this.state.page === 4 && (
                  <TeacherLiveReadWordHint word={this.state.word} />
                )}
                {this.state.page === 5 && <TeacherLiveWrite />}
                {this.state.page === 6 && (
                  <TeacherLiveWriteHint word={this.state.word} />
                )}
              </div>
            </div>
          )}
        </div>
      );
    } else if (this.state.page === 11) {
      return (
        <div>
          <h1>게임 1 페이지</h1>
          {this.state.timer !== 0 && <span>{this.state.timer}</span>}
        </div>
      );
    } else if (this.state.page === 21) {
      return (
        <div>
          <h1>게임 2 페이지</h1>
        </div>
      );
    }
  }

  render() {
    const mySessionId = this.mySessionId;
    const clazz = this.clazz;
    const localUser = this.state.localUser;
    const mainStreamUser = this.state.mainStreamUser;
    const trace = this.state.trace;

    return (
      <div className={styles.container} id="container">
        <ToolbarComponent
          sessionId={mySessionId}
          clazz={clazz}
          user={localUser}
          trace={trace}
          micStatusChanged={this.micStatusChanged}
          traceStatusChanged={this.traceStatusChanged}
          leaveSession={() => {
            if (window.confirm("강의를 종료하시겠습니까?")) {
              this.sendSignalExit();
            }
          }}
        />
        <div className={styles.contentContainer}>
          <div className={styles.video}>
            {mainStreamUser !== undefined &&
              mainStreamUser.getStreamManager() !== undefined && (
                <div
                  style={{
                    display: "inline-block",
                    width: "50%",
                    height: "50%",
                  }}
                  id="mainStreamUser"
                >
                  <div>포커스 중인 사람</div>
                  <StreamComponent user={mainStreamUser} />
                </div>
              )}
            {localUser !== undefined &&
              localUser.getStreamManager() !== undefined && (
                <div
                  style={{
                    display: "inline-block",
                    width: "300px",
                    height: "300px",
                  }}
                  id="localUser"
                >
                  <div>본인</div>
                  <StreamComponent user={localUser} />
                </div>
              )}
            {this.state.subscribers.map((sub, i) => (
              <div
                key={i}
                style={{
                  display: "inline-block",
                  width: "300px",
                  height: "300px",
                }}
                id="remoteUsers"
              >
                <IconButton
                  onClick={() => {
                    const data = {
                      target: sub.getConnectionId(),
                    };

                    this.sendSignalMic(data);
                  }}
                >
                  {sub.isAudioActive() ? <Mic /> : <MicOff color="secondary" />}
                </IconButton>
                <div
                  onClick={() => {
                    this.handleMainVideoStream(sub);
                  }}
                >
                  <StreamComponent
                    user={sub}
                    streamId={sub.streamManager.stream.streamId}
                  />
                </div>
              </div>
            ))}
          </div>
          <div>{this.renderComponent()}</div>
        </div>
      </div>
    );
  }
}
