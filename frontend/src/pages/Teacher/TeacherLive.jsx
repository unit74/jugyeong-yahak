import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import UserVideoComponent from '../../components/UserVideoComponent';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';

export default function TeacherLive() {
  const { state } = useLocation();
  const { clazz } = state;

  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  const [mySession, setMySession] = useState(null);

  const openVidu = new OpenVidu();
  const mySessionId = clazz.no;
  const myUserName = '교사 이름';

  const BASE_URL = 'https://i9e206.p.ssafy.io';
  // const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    joinSession();

    return () => {
      leaveSession();
    };
  }, []);

  const joinSession = () => {
    const session = openVidu.initSession();
    console.log('조인 세션 접속 ' + session);

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined);

      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    session.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    session.on('exception', (exception) => {
      console.warn(exception);
    });

    session.on('signal:userChanged', (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
    });

    getToken().then((token) => {
      session
        .connect(token, { clientData: myUserName })
        .then(async () => {
          let publisher = await openVidu.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
          });

          session.publish(publisher);

          setMainStreamManager(publisher);
          setPublisher(publisher);
        })
        .catch((error) => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
    });

    setMySession(session);
  };

  const leaveSession = async () => {
    if (mySession && mySession.connection) {
      try {
        await mySession.disconnect();
      } catch (error) {
        console.error('Error while disconnecting session:', error);
      }
      setMySession(null);
    }
  };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  const createSession = async (sessionId) => {
    const response = await axios.post(
      BASE_URL + '/api/v1/openvidu/sessions',
      { customSessionId: sessionId + '' },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(BASE_URL + '/api/v1/openvidu/' + sessionId + '/connections', {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data; // The token
  };

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== streamManager));
  };

  const sendSignalUserChanged = (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    };

    mySession.signal(signalOptions);
  };

  return (
    <div>
      <h1>{clazz.name} 라이브 중 입니다.</h1>
      <div
        id='video-container'
        style={{
          display: 'inline-block',
          width: '100px',
          height: '100px',
        }}
      >
        <div>
          {publisher !== undefined ? <UserVideoComponent streamManager={publisher} /> : null}
        </div>
        <div>
          {subscribers !== undefined
            ? subscribers.map((sub, i) => (
                <div key={i} className='stream-container col-md-6 col-xs-6'>
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))
            : null}
        </div>
      </div>

      <div>
        <button
          onClick={() => {
            sendSignalUserChanged({ isAudioAction: false });
          }}
        >
          Signal 보내보기
        </button>
        <button
          onClick={() => {
            leaveSession();
          }}
        >
          종료해보기
        </button>
      </div>
    </div>
  );
}
