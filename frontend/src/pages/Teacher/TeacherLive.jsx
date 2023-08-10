import { OpenVidu } from 'openvidu-browser';
import { Route, Routes } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import React, { Component } from 'react';
import './TeacherLive.module.css';
import StreamComponent from '../../components/StreamComponent';
import ToolbarComponent from '../../components/ToolbarComponent';
import UserModel from '../../models/user-model';

import Mic from '@mui/icons-material/Mic';
import MicOff from '@mui/icons-material/MicOff';
import IconButton from '@mui/material/IconButton';

var localUser = new UserModel();
const BASE_URL = 'https://i9e206.p.ssafy.io';

export default function TeacherLive() {
  const location = useLocation();
  const navigate = useNavigate();
  return <OpenViduSession state={location.state} navigate={navigate} />;
}

class OpenViduSession extends Component {
  constructor(props) {
    super(props);

    this.navigate = props.navigate;
    this.clazz = props.state.clazz;
    this.mySessionId = props.state.clazz.no;
    this.myUserName = '교사 이름';
    this.remotes = [];

    this.state = {
      mainStreamUser: undefined,
      session: undefined,
      localUser: undefined,
      subscribers: [],
      trace: false,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.handleMouseTraceOn = this.handleMouseTraceOn.bind(this);
    this.handleMouseTraceOff = this.handleMouseTraceOff.bind(this);
    this.updateMousePosition = this.updateMousePosition.bind(this);
    this.subscribeToUserChanged = this.subscribeToUserChanged.bind(this);
    this.deleteSubscriber = this.deleteSubscriber.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.connectWebCam = this.connectWebCam.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleMouseTraceOn);
    window.addEventListener('mouseup', this.handleMouseTraceOff);
    window.addEventListener('mousemove', this.updateMousePosition);
    window.addEventListener('beforeunload', this.onbeforeunload);
    this.login();
    this.joinSession();
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleMouseTraceOn);
    window.removeEventListener('mouseup', this.handleMouseTraceOff);
    window.removeEventListener('mousemove', this.updateMousePosition);
    window.removeEventListener('beforeunload', this.onbeforeunload);
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
      console.log('Token : ' + token);
      this.connect(token);
    } catch (error) {
      console.error('There was an error getting the token:', error.code, error.message);
      if (this.props.error) {
        this.props.error({
          error: error.error,
          messgae: error.message,
          code: error.code,
          status: error.status,
        });
      }
      alert('There was an error getting the token:', error.message);
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
        alert('There was an error connecting to the session:', error.message);
        console.log('There was an error connecting to the session:', error.code, error.message);
      });
  }

  async connectWebCam() {
    let publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: localUser.isAudioActive(),
      publishVideo: true,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
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
      trace: false,
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
    this.state.session.on('streamCreated', (event) => {
      const subscriber = this.state.session.subscribe(event.stream, undefined);

      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      newUser.setType('remote');
      const nickname = event.stream.connection.data.split('%')[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      this.remotes.push(newUser);

      this.updateSubscribers();

      const data = {};

      this.sendSignalInit(data);
    });
  }

  subscribeToStreamDestroyed() {
    this.state.session.on('streamDestroyed', (event) => {
      this.deleteSubscriber(event.stream);
      event.preventDefault();
    });
  }

  subscribeToUserChanged() {
    this.state.session.on('signal:userChanged', (event) => {
      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log('EVENTO REMOTE: ', event.data);
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
    this.state.session.on('signal:mic', (event) => {
      const data = JSON.parse(event.data);

      if (localUser && localUser.getConnectionId() === data.target) this.micStatusChanged();
    });
  }

  sendSignalUserChanged(data) {
    this.sendSignal(data, 'userChanged');
  }

  sendSignalInit(data) {
    this.sendSignal(data, 'init');
  }

  sendSignalMic(data) {
    this.sendSignal(data, 'mic');
  }

  sendSignalMouse(data) {
    this.sendSignal(data, 'mouse');
  }

  sendSignal(data, page) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: page,
    };
    this.state.session.signal(signalOptions);
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

        this.sendSignalMouse(data);
      }
    );
  }

  updateMousePosition(e) {
    if (!this.state.trace) return;

    const data = {
      x: e.clientX,
      y: e.clientY,
    };

    this.sendSignalMouse(data);
  }

  async login() {
    await axios
      .post(`${BASE_URL}/api/v1/auth/governments/login`, {
        // 지자체 로그인으로 우선 테스트
        identification: 'string', // 아이디 비밀번호가 실제로 string/string임..
        password: 'string',
      })
      .then(function (response) {
        const data = response.data.data;

        localStorage.setItem('token', data.token);
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
      BASE_URL + '/api/v1/openvidu/sessions',
      { customSessionId: sessionId + '' },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  }

  async createToken(sessionId) {
    const response = await axios.post(
      BASE_URL + '/api/v1/openvidu/' + sessionId + '/connections',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  }

  render() {
    const mySessionId = this.mySessionId;
    const clazz = this.clazz;
    const localUser = this.state.localUser;
    const mainStreamUser = this.state.mainStreamUser;

    return (
      <div className='container' id='container'>
        <ToolbarComponent
          sessionId={mySessionId}
          clazz={clazz}
          user={localUser}
          micStatusChanged={this.micStatusChanged}
          leaveSession={this.leaveSession}
        />

        <div>
          {mainStreamUser !== undefined && mainStreamUser.getStreamManager() !== undefined && (
            <div
              style={{
                display: 'inline-block',
                width: '300px',
                height: '300px',
              }}
              id='mainStreamUser'
            >
              <div>포커스 중인 사람</div>
              <StreamComponent user={mainStreamUser} />
            </div>
          )}
          {localUser !== undefined && localUser.getStreamManager() !== undefined && (
            <div
              style={{
                display: 'inline-block',
                width: '300px',
                height: '300px',
              }}
              id='localUser'
            >
              <div>본인</div>
              <StreamComponent user={localUser} />
            </div>
          )}
          {this.state.subscribers.map((sub, i) => (
            <div
              key={i}
              style={{
                display: 'inline-block',
                width: '300px',
                height: '300px',
              }}
              id='remoteUsers'
            >
              <IconButton
                onClick={() => {
                  const data = {
                    target: sub.getConnectionId(),
                  };

                  this.sendSignalMic(data);
                }}
              >
                {sub.isAudioActive() ? <Mic /> : <MicOff color='secondary' />}
              </IconButton>
              <div
                onClick={() => {
                  this.handleMainVideoStream(sub);
                }}
              >
                <StreamComponent user={sub} streamId={sub.streamManager.stream.streamId} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
