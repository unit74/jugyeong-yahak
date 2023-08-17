import { OpenVidu } from "openvidu-browser";
import { useNavigate, Outlet } from "react-router-dom";

import axios from "../Common/api/authAxios";
import React, { Component, createContext, useState, useEffect } from "react";
import StreamComponent from "../../components/StreamComponent";
import UserModel from "../../models/user-model";

import ThumbUpAlt from "@mui/icons-material/ThumbUpAlt";

import styles from "./StudentLive.module.css";

var localUser = new UserModel();
const BASE_URL = "https://i9e206.p.ssafy.io";
export const OpenViduSessionContext = createContext();

export default function StudentLive() {
  const navigate = useNavigate();
  const classId = JSON.parse(localStorage.getItem("userInfo")).classId;

  const [clazz, setClazz] = useState(undefined);

  useEffect(() => {
    async function getClass() {
      await axios
        .get(`${BASE_URL}/api/v1/classes/${classId}`)
        .then(function (response) {
          const data = response.data.data;

          setClazz(data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    getClass();
    return () => {
      setClazz(undefined);
    };
  }, [classId]);

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
    this.myUserName = JSON.parse(localStorage.getItem("userInfo")).name;
    this.remotes = [];

    this.state = {
      mainStreamUser: undefined,
      session: undefined,
      localUser: undefined,
      subscribers: [],
      mouse: { x: null, y: null },
      page: null,
      theme: null,
      curriculum: null,
      word: null,
      choseong: null,
      timer: 0,
      quiz: false,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.connectWebCam = this.connectWebCam.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.deleteSubscriber = this.deleteSubscriber.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.correctStatusChanged = this.correctStatusChanged.bind(this);
    this.sendSignal = this.sendSignal.bind(this);

    this.subscribeToStreamCreated = this.subscribeToStreamCreated.bind(this);
    this.subscribeToStreamDestroyed = this.subscribeToStreamDestroyed.bind(this);
    this.subscribeToUserChanged = this.subscribeToUserChanged.bind(this);
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
    this.subscribeToMouse = this.subscribeToMouse.bind(this);
    this.subscribeToInit = this.subscribeToInit.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
    this.joinSession();
  }

  componentWillUnmount() {
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
      console.error("There was an error getting the token:", error.code, error.message);
      if (this.props.error) {
        this.props.error({
          error: error.error,
          messgae: error.message,
          code: error.code,
          status: error.status,
        });
      }
      alert("There was an error getting the token:", error.message);

      this.navigate("/", { replace: true });
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
        console.log("There was an error connecting to the session:", error.code, error.message);
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
    this.subscribeToInit();
    this.subscribeToMouse();

    this.setState({
      mainStreamUser: localUser,
      localUser: localUser,
    });
  }

  updateSubscribers() {
    var subscribers = this.remotes;
    this.setState({ subscribers: subscribers }, () => {
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
    });
  }

  async leaveSession() {
    const mySession = this.state.session;

    if (mySession) {
      this.OV = null;
      mySession.disconnect();

      this.setState({
        mainStreamUser: undefined,
        session: undefined,
        localUser: undefined,
        subscribers: [],
        mouse: { x: null, y: null },
        page: null,
        theme: null,
        curriculum: null,
        word: null,
        choseong: null,
        timer: 0,
      });
    }
  }

  micStatusChanged() {
    localUser.setAudioActive(!localUser.isAudioActive());
    localUser.getStreamManager().publishAudio(localUser.isAudioActive());
    this.sendSignal({ isAudioActive: localUser.isAudioActive() }, "userChanged");
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
    const userStream = remoteUsers.filter((user) => user.getStreamManager().stream === stream)[0];
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
    });
  }

  subscribeToStreamDestroyed() {
    this.state.session.on("streamDestroyed", (event) => {
      this.deleteSubscriber(event.stream);
      event.preventDefault();
    });
  }

  subscribeToInit() {
    this.state.session.on("signal:init", (event) => {
      const data = JSON.parse(event.data);

      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          this.handleMainVideoStream(user);
        }
      });

      remoteUsers = remoteUsers.filter(
        (user) => user.getConnectionId() !== event.from.connectionId
      );

      this.setState(
        {
          subscribers: remoteUsers,
          quiz: data.quiz,
          timer: data.timer,
          theme: data.theme,
          word: data.word,
          curriculum: data.curriculum,
          choseong: data.choseong,
          page: data.page,
        },
        () => {
          if (this.state.page !== null) this.navigate(`/student-live/${this.state.page}`);
        }
      );
    });
  }

  subscribeToUserChanged() {
    this.state.session.on("signal:userChanged", (event) => {
      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log("EVENTO REMOTE: ", event.data);
          if (data.isAudioActive !== undefined) user.setAudioActive(data.isAudioActive);
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

      if (localUser && localUser.getConnectionId() === data.target) this.micStatusChanged();
    });
  }

  subscribeToMouse() {
    this.state.session.on("signal:mouse", (event) => {
      const data = JSON.parse(event.data);

      this.setState({
        mouse: { x: data.x, y: data.y },
      });
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
      this.navigate("/", { replace: true });
    });
  }

  subscribeToTimer() {
    this.state.session.on("signal:timer", (event) => {
      const data = JSON.parse(event.data);

      this.setState({ timer: data.timer });
    });
  }

  subscribeToQuiz() {
    this.state.session.on("signal:quiz", (event) => {
      const data = JSON.parse(event.data);

      this.setState({ quiz: data.quiz });
      this.correctStatusChanged(false);
    });
  }

  subscribeToTheme() {
    this.state.session.on("signal:theme", (event) => {
      const data = JSON.parse(event.data);

      this.setState({ theme: data.theme });
    });
  }

  subscribeToWord() {
    this.state.session.on("signal:word", (event) => {
      const data = JSON.parse(event.data);

      this.setState({ word: data.word });
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
        this.navigate(`/student-live/${this.state.page}`);
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

  async getToken() {
    return await this.createToken(this.mySessionId);
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
    console.log(sessionId);
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
    const quiz = this.state.quiz;
    const containerClass = this.state.isOpen
      ? `${styles.container} ${styles["sidebar-open"]}`
      : styles.container;

    // 리턴
    return (
      <div className={containerClass} id="container" style={{ overflow: "hidden" }}>
        <div className={styles.contentContainer}>
          <div className={styles.contentLeft}>
            <OpenViduSessionContext.Provider value={this.sendSignal.bind(this)}>
              <Outlet
                context={{
                  theme: this.state.theme,
                  curriculum: this.state.curriculum,
                  word: this.state.word,
                  timer: this.state.timer,
                  choseong: this.state.choseong,
                }}
              />
            </OpenViduSessionContext.Provider>
          </div>
          <div className={styles.contentRight}>
            <div className={styles.video} style={{ display: "flex", gap: "5px" }}>
              {localUser !== undefined && localUser.getStreamManager() !== undefined && (
                <div
                  style={{
                    display: "inline-block",
                    width: "300px",
                    height: "200px",
                    position: "relative",

                    paddingTop: "3%",
                  }}
                  id="localUser"
                >
                  {/* <div>본인</div> */}
                  <StreamComponent user={localUser} />
                </div>
              )}
              {mainStreamUser !== undefined && mainStreamUser.getStreamManager() !== undefined && (
                <div
                  style={{
                    display: "inline-block",
                    width: "300px",
                    height: "200px",
                    // botton: "-10px",
                    position: "relative",

                    paddingTop: "3%",
                  }}
                  id="mainStreamUser"
                >
                  {/* <div>포커스 중인 사람</div> */}
                  <StreamComponent user={mainStreamUser} />
                </div>
              )}
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={sub.getConnectionId()}
                  className={styles.remoteUser}
                  id="remoteUsers"
                  style={{
                    display: "inline-block",
                    width: "300px",
                    height: "250px",
                    // botton: "-10px",
                    position: "relative",
                    paddingTop: "2%",
                  }}
                >
                  <div className={styles.iconButtonsGroup}>
                    {quiz && sub.isCorrect() && <ThumbUpAlt />}
                  </div>
                  <div>
                    <StreamComponent user={sub} streamId={sub.streamManager.stream.streamId} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {this.state.mouse && this.state.mouse.x !== null && this.state.mouse.y !== null && (
            <div
              style={{
                position: "absolute",
                left: `${this.state.mouse.x - 10}px`,
                top: `${this.state.mouse.y - 10}px`,
                height: "50px",
                width: "50px",
                borderRadius: "50%",
                backgroundColor: "#FF6363",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                border: "2px solid white",
              }}
            />
          )}
        </div>
      </div>
    );
  }
}
