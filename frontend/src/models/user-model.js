class UserModel {
  connectionId;
  audioActive;
  nickname;
  streamManager;
  type; // 'remote' | 'local'

  constructor() {
    this.connectionId = '';
    this.audioActive = true;
    this.nickname = '';
    this.streamManager = null;
    this.type = 'local';
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

  isLocal() {
    return this.type === 'local';
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
    if ((type === 'local') | (type === 'remote')) {
      this.type = type;
    }
  }
}

export default UserModel;
