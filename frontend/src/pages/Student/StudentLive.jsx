import React, { Component } from "react";
import styles from "./StudentLive.module.css";
import { OpenVidu } from "openvidu-browser";
import { useNavigate } from "react-router-dom";
import StreamComponent from "../../components/StreamComponent";
import UserModel from "../../models/user-model";

import axios from "axios";

var localUser = new UserModel();
const BASE_URL = "https://i9e206.p.ssafy.io";
// 학생 라이브
// 근데 오픈비두 이식하면 또 바뀔듯....
export default function StudentLive() {
  const navigate = useNavigate();

  const clazz = {
    no: 1,
    name: "새싹반",
  };
  // 태그 생성부분
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.time}>
          <OpenViduSession clazz={clazz} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

class OpenViduSession extends Component {
  constructor(props) {
    super(props);

    this.navigate = props.navigate;
    this.clazz = props.clazz;
    this.mySessionId = props.clazz.no;
    this.myUserName = "학생" + Math.floor(Math.random() * 100);
    this.remotes = [];

    this.state = {
      mainStreamUser: undefined,
      session: undefined,
      localUser: undefined,
      subscribers: [],
      mouse: { x: null, y: null },
    };

    this.joinSession = this.joinSession.bind(this);
    this.connectWebCam = this.connectWebCam.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.deleteSubscriber = this.deleteSubscriber.bind(this);
    this.subscribeToInit = this.subscribeToInit.bind(this);
    this.subscribeToUserChanged = this.subscribeToUserChanged.bind(this);
    this.subscribeToMouse = this.subscribeToMouse.bind(this);
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
    this.subscribeToInit();
    this.subscribeToMouse();

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

  leaveSession() {
    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    this.OV = null;
    this.setState({
      mainStreamUser: undefined,
      session: undefined,
      localUser: undefined,
      subscribers: [],
      mouse: { x: null, y: null },
    });
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

      this.setState({
        subscribers: remoteUsers,
      });
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

  subscribeToMouse() {
    this.state.session.on("signal:mouse", (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      this.setState(
        {
          mouse: { x: data.x, y: data.y },
        },
        () => {
          console.log(this.state.mouse);
        }
      );
    });
  }

  sendSignalUserChanged(data) {
    this.sendSignal(data, "userChanged");
  }

  sendSignalMic(data) {
    this.sendSignal(data, "mic");
  }

  sendSignal(data, page) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: page,
    };
    this.state.session.signal(signalOptions);
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

  render() {
    const localUser = this.state.localUser;
    const mainStreamUser = this.state.mainStreamUser;

    return (
      <div className="container" id="container">
        <div>
          {mainStreamUser !== undefined &&
            mainStreamUser.getStreamManager() !== undefined && (
              <div
                style={{
                  display: "inline-block",
                  width: "300px",
                  height: "300px",
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
        {this.state.mouse &&
          this.state.mouse.x !== null &&
          this.state.mouse.y != null && (
            <div
              style={{
                position: "absolute",
                left: `${this.state.mouse.x - 10}px`, // 원 중앙을 정확한 포인트에 위치시키기 위해 조정
                top: `${this.state.mouse.y - 10}px`, // 원 중앙을 정확한 포인트에 위치시키기 위해 조정
                height: "20px",
                width: "20px",
                borderRadius: "50%",
                backgroundColor: "#FF6363", // 빨간색의 톤 다운 버전
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)", // 약간의 그림자 효과
                border: "2px solid white", // 테두리 효과
              }}
            />
          )}
      </div>
    );
  }
}
