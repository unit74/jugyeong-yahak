import { OpenVidu } from "openvidu-browser";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import axios from "../Common/api/authAxios";
import React, { Component, createContext } from "react";
import "./TeacherLive.module.css";
import StreamComponent from "../../components/StreamComponent";
import ToolbarComponent from "../../components/ToolbarComponent";
import UserModel from "../../models/user-model";

import Mic from "@mui/icons-material/Mic";
import MicOff from "@mui/icons-material/MicOff";
import Check from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";

import styles from "./TeacherLive.module.css";

import { useSelector } from "react-redux";

var localUser = new UserModel();
const BASE_URL = "https://i9e206.p.ssafy.io";
export const OpenViduSessionContext = createContext();

export default function TeacherLive() {
  const navigate = useNavigate();
  const clazz = useSelector((state) => state.liveClassState.clazz);

  if (!clazz) {
    return <div>Loading...</div>;
  }

  return <OpenViduSession clazz={clazz} navigate={navigate} />;
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
      quiz: false,
      count: 0,
      isOpen: false,
      pages: [],
      words: [],
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.connectWebCam = this.connectWebCam.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.deleteSubscriber = this.deleteSubscriber.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.correctStatusChanged = this.correctStatusChanged.bind(this);
    this.traceStatusChanged = this.traceStatusChanged.bind(this);
    this.updateMousePosition = this.updateMousePosition.bind(this);
    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.changeMenus = this.changeMenus.bind(this);
    this.sendSignal = this.sendSignal.bind(this);

    this.subscribeToUserChanged = this.subscribeToUserChanged.bind(this);
    this.subscribeToStreamDestroyed =
      this.subscribeToStreamDestroyed.bind(this);
    this.subscribeToMic = this.subscribeToMic.bind(this);
    this.subscribeToExit = this.subscribeToExit.bind(this);
    this.subscribeToTimer = this.subscribeToTimer.bind(this);
    this.subscribeToCorrect = this.subscribeToCorrect.bind(this);
    this.subscribeToQuiz = this.subscribeToQuiz.bind(this);
    this.subscribeToTheme = this.subscribeToTheme.bind(this);
    this.subscribeToWord = this.subscribeToWord.bind(this);
    this.subscribeToCurriculum = this.subscribeToCurriculum.bind(this);
    this.subscribeToChoseong = this.subscribeToChoseong.bind(this);
    this.subscribeToPage = this.subscribeToPage.bind(this);
  }

  componentDidMount() {
    window.addEventListener("mousemove", this.updateMousePosition);
    window.addEventListener("beforeunload", this.onbeforeunload);
    this.joinSession();

    const pages = [
      {
        name: "커리큘럼 선택",
        path: "theme",
      },
    ];

    this.changeMenus(pages, []);
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
    const BASE_URL_SSE = "https://i9e206.p.ssafy.io/sse/v1";

    this.setState(
      {
        session: this.OV.initSession(),
      },
      async () => {
        this.subscribeToStreamCreated();
        await this.connectToSession();

        await axios.post(`${BASE_URL_SSE}/convert/page`, {
          classId: useLocation().state.clazz,
          streamId: 0,
          number: 0,
        });
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
    this.subscribeToCorrect();
    this.subscribeToQuiz();
    this.subscribeToTheme();
    this.subscribeToWord();
    this.subscribeToCurriculum();
    this.subscribeToChoseong();
    this.subscribeToPage();

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
          this.sendSignal(
            {
              isAudioActive: this.state.localUser.isAudioActive(),
              nickname: this.state.localUser.getNickname(),
              isCorrect: this.state.localUser.isCorrect(),
            },
            "userChanged"
          );
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
          quiz: false,
          count: 0,
          isOpen: false,
          pages: [],
          words: [],
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
    this.sendSignal(
      { isAudioActive: localUser.isAudioActive() },
      "userChanged"
    );
    this.setState({ localUser: localUser });
  }

  correctStatusChanged(correct) {
    localUser.setCorrect(correct);
    this.sendSignal({ isCorrect: localUser.isCorrect() }, "userChanged");
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
        quiz: this.state.quiz,
        timer: this.state.timer,
        theme: this.state.theme,
        word: this.state.word,
        curriculum: this.state.curriculum,
        choseong: this.state.choseong,
        page: this.state.page,
      };

      this.sendSignal(data, "init");
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
          if (data.isAudioActive !== undefined)
            user.setAudioActive(data.isAudioActive);
          if (data.nickname !== undefined) user.setNickname(data.nickname);
          if (data.isCorrect !== undefined) user.setCorrect(data.isCorrect);
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

  subscribeToCorrect() {
    this.state.session.on("signal:correct", (event) => {
      const data = JSON.parse(event.data);

      if (localUser && localUser.getConnectionId() === data.target)
        this.correctStatusChanged(data.correct);
    });
  }

  subscribeToExit() {
    this.state.session.on("signal:exit", (event) => {
      this.leaveSession();
      this.navigate("/");
    });
  }

  subscribeToTimer() {
    this.state.session.on("signal:timer", (event) => {
      const data = JSON.parse(event.data);

      if (!this.state.quiz) data.timer = 0;

      this.setState(
        {
          timer: data.timer,
        },
        () => {
          if (this.state.timer > 0 && this.state.quiz) {
            const sendData = {
              timer: this.state.timer - 1,
            };

            setTimeout(() => this.sendSignal(sendData, "timer"), 1000);
          }
        }
      );
    });
  }

  subscribeToQuiz() {
    this.state.session.on("signal:quiz", (event) => {
      const data = JSON.parse(event.data);

      if (this.state.quiz && !data.quiz) {
        // 게임 종료
        if (this.state.timer > 0) this.sendSignal({ page: "" }, "page");
        else this.sendSignal({ page: "" }, "page");

        this.sendSignal({ timer: 0 }, "timer");
        this.setState({ quiz: data.quiz });
      } else if (!this.state.quiz && data.quiz) {
        // 게임 시작
        this.correctStatusChanged(false);
        this.setState({ quiz: data.quiz, count: 0 }, () => {
          this.sendSignal({ timer: 900 }, "timer");
        });
      }
    });
  }

  subscribeToTheme() {
    this.state.session.on("signal:theme", (event) => {
      const data = JSON.parse(event.data);

      this.setState({
        theme: data.theme,
      });
    });
  }

  subscribeToWord() {
    this.state.session.on("signal:word", (event) => {
      const data = JSON.parse(event.data);

      this.setState({
        word: data.word,
      });
    });
  }

  subscribeToCurriculum() {
    this.state.session.on("signal:curriculum", (event) => {
      const data = JSON.parse(event.data);

      this.setState({
        curriculum: data.curriculum,
      });
    });
  }

  subscribeToChoseong() {
    this.state.session.on("signal:choseong", (event) => {
      const data = JSON.parse(event.data);

      this.setState({
        choseong: data.choseong,
      });
    });
  }

  subscribeToPage() {
    this.state.session.on("signal:page", (event) => {
      const data = JSON.parse(event.data);

      this.setState({ page: data.page }, () => {
        this.navigate(`/teacher-live/${this.state.page}`);
      });
    });
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

      this.sendSignal(data, "mouse");
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

    this.sendSignal(data, "mouse");
  }

  openSidebar() {
    this.setState({
      isOpen: true,
    });
  }

  closeSidebar() {
    this.setState({
      isOpen: false,
    });
  }

  changeMenus(pages, words) {
    this.closeSidebar();
    this.setState({
      pages: pages,
      words: words,
    });
    setTimeout(() => this.openSidebar(), 300);
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

  render() {
    const mySessionId = this.mySessionId;
    const clazz = this.clazz;
    const localUser = this.state.localUser;
    const mainStreamUser = this.state.mainStreamUser;
    const trace = this.state.trace;
    const isOpen = this.state.isOpen;
    const pages = this.state.pages;
    const words = this.state.words;
    const quiz = this.state.quiz;
    const containerClass = this.state.isOpen
      ? `${styles.container} ${styles["sidebar-open"]}`
      : styles.container;

    // 리턴
    return (
      <div className={containerClass} id="container">
        <ToolbarComponent
          sessionId={mySessionId}
          clazz={clazz}
          user={localUser}
          trace={trace}
          isOpen={isOpen}
          pages={pages}
          words={words}
          micStatusChanged={this.micStatusChanged}
          traceStatusChanged={this.traceStatusChanged}
          openSidebar={this.openSidebar}
          closeSidebar={this.closeSidebar}
          sendSignal={this.sendSignal}
          leaveSession={() => {
            if (window.confirm("강의를 종료하시겠습니까?")) {
              this.sendSignal(undefined, "exit");
            }
          }}
        />
        <div className={styles.contentContainer}>
          <div className={styles.contentLeft}>
            <button
              onClick={() => {
                this.navigate("/teacher-live/theme");
              }}
            >
              커리큘럼 선택 (테스트용 버튼)
            </button>
            {this.state.curriculum && (
              <div>
                {this.state.curriculum.wordList.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      this.setState({ word: word.word });
                    }}
                  >
                    {word.word}
                  </button>
                ))}
              </div>
            )}
            {this.state.word && (
              <div>
                <button
                  onClick={() => {
                    this.navigate("/teacher-live/read");
                  }}
                >
                  읽기 페이지로 (테스트용 버튼)
                </button>
                <button
                  onClick={() => {
                    this.navigate("/teacher-live/read-hint");
                  }}
                >
                  읽기 힌트 페이지로 (테스트용 버튼)
                </button>
              </div>
            )}
            <OpenViduSessionContext.Provider value={this.sendSignal.bind(this)}>
              <Outlet
                context={{
                  theme: this.state.theme,
                  curriculum: this.state.curriculum,
                  word: this.state.word,
                }}
              />
            </OpenViduSessionContext.Provider>
          </div>
          <div className={styles.contentRight}>
            <div className={styles.video}>
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
                      this.sendSignal({ target: sub.getConnectionId() }, "mic");
                    }}
                  >
                    {sub.isAudioActive() ? (
                      <Mic />
                    ) : (
                      <MicOff color="secondary" />
                    )}
                  </IconButton>
                  {quiz && !sub.isCorrect() && (
                    <IconButton
                      onClick={() => {
                        this.sendSignal(
                          { target: sub.getConnectionId(), correct: true },
                          "correct"
                        );

                        this.setState({ count: this.state.count + 1 }, () => {
                          if (
                            this.state.count === this.state.subscribers.length
                          ) {
                            this.sendSignal({ quiz: false }, "quiz");
                          }
                        });
                      }}
                    >
                      <Check />
                    </IconButton>
                  )}
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
          </div>
        </div>
      </div>
    );
  }
}
