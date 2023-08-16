class UserModel {
  connectionId;
  audioActive;
  nickname;
  streamManager;
  type; // 'remote' | 'local'
  correct;

  constructor() {
    this.connectionId = "";
    this.audioActive = true;
    this.nickname = "";
    this.streamManager = null;
    this.type = "local";
    this.correct = false;
  }

  isAudioActive() {
    return this.audioActive;
  }

  getConnectionId() {
    return this.connectionId;
  }

  getNickname() {
    return this.nickname;
  }

  getStreamManager() {
    return this.streamManager;
  }
  isCorrect() {
    return this.correct;
  }
  isLocal() {
    return this.type === "local";
  }
  isRemote() {
    return !this.isLocal();
  }
  setAudioActive(isAudioActive) {
    this.audioActive = isAudioActive;
  }
  setStreamManager(streamManager) {
    this.streamManager = streamManager;
  }
  setConnectionId(connectionId) {
    this.connectionId = connectionId;
  }
  setNickname(nickname) {
    this.nickname = nickname;
  }
  setType(type) {
    if ((type === "local") | (type === "remote")) {
      this.type = type;
    }
  }
  setCorrect(correct) {
    this.correct = correct;
  }
}

export default UserModel;
