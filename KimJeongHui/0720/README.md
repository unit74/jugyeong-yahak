## 정희 - openvidu

- openvidu server
  - openvidu kms server를 설치해야 sessino을 만들 수 있음
  - 도커 설치 후 다음 명령어 입력하면 4443포트로 server가 백그라운드로 구동됨
      <aside>
      💡 docker run -d -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-dev:2.28.0
      
      </aside>

- spring server
  - 깃 클론
      <aside>
      💡 git clone https://github.com/OpenVidu/openvidu-tutorials.git -b v2.28.0
      
      </aside>

  - 실행
      <aside>
      💡 cd openvidu-tutorials/openvidu-basic-java
      mvn spring-boot:run
      
      </aside>

  - 주의사항
    - mvn 설치해야됨
- react
  - 실행
      <aside>
      💡 cd openvidu-tutorials/openvidu-react
      npm install
      npm start
      
      </aside>

  - 주의사항
    - npm 설치해야됨
    - 코드 안에 server url를 [localhost](http://localhost):5000으로 바꿔주면 spring server에 접근할 수 있음
