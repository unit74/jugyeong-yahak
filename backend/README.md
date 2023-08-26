# Backend

```
저희는 다양한 서버를 운용하고 있습니다.
```

### http

```
전형적인 REST API Spring boot 서버입니다. 주로 Database와 통신해 CRUD를 담당하고 있습니다. 예외적으로, OpenVidu 서버와의 connection 생성까지 담당하고 있습니다.
```

### node

```
fast-api를 이용해 로그인 이미지 유사도 측정을 위한 Node.js 서버입니다. AWS S3에서 이미지를 가져와 로그인하는 유저와 얼굴 유사도 측정을 담당하고 있습니다.
```

### sse

```
실시간 알림을 위해 사용하는 SSE 통신 방식의 Spring Boot 서버입니다. 푸쉬 알림 기능을 구현하기 위해 사용하였고, 교사가 실시간 수업을 시작하면, 해당하는 반의 학생들을 다 실시간 수업으로 데려오기 위해 사용하고 있습니다.
```

### tts_server

```
Naver Clovar API와 연동하여 Text-to-speech의 기능을 수행하기 위한 Node.js 서버입니다.
```
