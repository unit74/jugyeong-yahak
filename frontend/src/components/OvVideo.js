import React, { Component } from 'react';

export default class OvVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    if (this.props && this.props.user.streamManager && !!this.videoRef) {
      console.log('PROPS: ', this.props);
      this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
    }
  }

  componentDidUpdate(props) {
    if (props && !!this.videoRef) {
      this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
    }
  }

  render() {
    return (
      <video
        autoPlay={true}
        style={{ display: 'block', width: '100%', height: '100%' }}
        id={'video-' + this.props.user.getStreamManager().stream.streamId}
        ref={this.videoRef}
      />
    );
  }
}
