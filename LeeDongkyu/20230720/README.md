# 20230720 회고록

| Google Cloud API를 이용한 손글씨 인식 기술에 대한 연구를 진행하였습니다. 공식 API를 사용해 매우 높은 인식률을 보였고, 실시간으로 입력된 글자를 인식하는데 있어서 여러 고민을 해야합니다.

```jsx
음.. 일단 해봤는데요.. 일단 Google API에서 Stream 환경 중 Text 인식은 없습니다. 그래서 테스트 해본게 이미지 Text 인식, 동영상 Text 인식인데 이미지는 Text 인식률이 굉장히 높습니다. 다만, 동영상은 Text 인식률이 좋지는 않네요.

그러면.. 최대한 이미지 Text로 가는게 좋을 것 같은데...

아마.. Google API가 Open source 인식률이 높다는 가정하에? 2가지 방향성이 있을 듯 합니다.

1. Stream 영상을 서버 단에서 계속 Text 인식하기 -> Open source 사용
2. Stream 영상을 서버 단에서 공책을 들었는지? 계속 확인하고 들었다면 캡쳐해서 Text 인식하기 -> Google API 사용
2.1 공책을 들었는지는 객체 탐지 Open source나 Text Detection Open source를 이용하기
```
