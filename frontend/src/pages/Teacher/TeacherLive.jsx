import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import UserVideoComponent from "../../components/UserVideoComponent";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";

export default function TeacherLive() {
  const { state } = useLocation();
  const { clazz } = state;

  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  const mySessionId = clazz.no;
  const myUserName = "교사 이름";

  const BASE_URL = "https://i9e206.p.ssafy.io";
  // const BASE_URL = "http://localhost:8080";

  const openViduRef = useRef(new OpenVidu());  // Use useRef to persist the instance
  const mySessionRef = useRef(null);
  useEffect(() => {
    joinSession();
    
    return () => {
      leaveSession();
    };
  }, []);

  const joinSession = () => {
    mySessionRef.current = openViduRef.current.initSession();
    console.log("조인 세션 접속");

    mySessionRef.current.on('streamCreated', (event) => {
      const subscriber = mySessionRef.current.subscribe(event.stream, undefined);

      setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
    });

    mySessionRef.current.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySessionRef.current.on('exception', (exception) => {
      console.warn(exception);
    });

    getToken().then((token) => {
      mySessionRef.current
        .connect(token, { clientData: myUserName })
        .then(async () => {
          let publisher = await openViduRef.current.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false,
          });

          mySessionRef.current.publish(publisher);

          setMainStreamManager(publisher);
          setPublisher(publisher);
        })
        .catch((error) => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
    });
  };

  const leaveSession = async () => {
    if (mySessionRef.current) {
      try {
        await mySessionRef.current.disconnect();
        console.log("세션 종료");
      } catch (error) {
        console.error("Error while disconnecting session:", error);
      }
      mySessionRef.current = null;
    }
  };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  const createSession = async (sessionId) => {
    const response = await axios.post(
      BASE_URL + '/api/v1/openvidu/sessions',
      { customSessionId: sessionId + "" },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      BASE_URL + '/api/v1/openvidu/' + sessionId + '/connections',
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The token
  };

  const deleteSubscriber = (streamManager) => {
    setSubscribers(prevSubscribers => prevSubscribers.filter(sub => sub !== streamManager));
  };

  return (
    <div>
      <h1>{clazz.name} 라이브 중 입니다.</h1>
      <div id="video-container" className="col-md-6">
        <div className="teacher-video">
          {publisher !== undefined ? (
            <UserVideoComponent streamManager={publisher} />
          ) : null}
        </div>
        <div className="students-container">
          {subscribers !== undefined ? subscribers.map((sub, i) => (
            <div
              key={i}
              className="stream-container col-md-3 col-xs-3"
            >
              <span>{sub.id}</span>
              <UserVideoComponent streamManager={sub} />
            </div>
          )) : null}
        </div>
      </div>
    </div>
  );
  
}
