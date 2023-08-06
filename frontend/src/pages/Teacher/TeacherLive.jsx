import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function TeacherLive() {
  const { state } = useLocation();
  const { clazz } = state;
  const [mySessionId, setMySessionId] = useState(clazz.no);
  const [myUserName, setMyUserName] = useState('참가자 이름');
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    return () => {};
  }, []);

  const joinSession = () => {
    this.OV = new OpenVidu();

    const mySession = this.OV.initSession();
    setSession(mySession);

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      const subscribers = this.state.subscribers;
      subscribers.push(subscriber);

      setSubscribers(subScribers);
    });

    mySession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on('exception', (exception) => {
      console.warn(exception);
    });

    getToken().then((token) => {
      mySession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          let publisher = await this.OV.initPublisherAsync(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---

          mySession.publish(publisher);

          // Obtain the current video device in use
          var devices = await this.OV.getDevices();
          var videoDevices = devices.filter((device) => device.kind === 'videoinput');
          var currentVideoDeviceId = publisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          var currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          // Set the main video in the page to display our webcam and store our Publisher
          this.setState({
            currentVideoDevice: currentVideoDevice,
            mainStreamManager: publisher,
            publisher: publisher,
          });
        })
        .catch((error) => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
    });
  };

  const leaveSession = () => {
    const mySession = session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(clazz.no);
    setMyUserName('참가자 이름');
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  const getToken = async () => {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  };

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/v1/openvidu/sessions',
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/v1/openvidu/' + sessionId + '/connections'
    );
    return response.data; // The token
  };

  const deleteSubscriber = (streamManager) => {
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      setSubscribers(subScribers);
    }
  };

  return (
    <div>
      <h1>{clazz.name} 라이브 중 입니다.</h1>
    </div>
  );
}
