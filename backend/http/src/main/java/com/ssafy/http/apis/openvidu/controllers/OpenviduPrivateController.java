package com.ssafy.http.apis.openvidu.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.fcm.services.FcmService;
import com.ssafy.http.apis.members.services.MemberService;
import com.ssafy.http.apis.openvidu.requests.InitOpenViduRequest;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/private/openvidu")
public class OpenviduPrivateController {

  @Value("${OPENVIDU_URL}")
  private String OPENVIDU_URL;

  @Value("${OPENVIDU_SECRET}")
  private String OPENVIDU_SECRET;

  private OpenVidu openvidu;

  @PostConstruct
  public void init() {
    this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
  }

  private final MemberService memberService;
  private final FcmService fcmService;

  @PostMapping("/sessions")
  public ResponseEntity<String> initializeSession(
      @RequestBody InitOpenViduRequest initOpenViduRequest)
      throws OpenViduJavaClientException, OpenViduHttpException {

    //교사에게 classId 할당
    memberService.setTeacherClassId(SecurityUtil.getLoginUserId(),
        Long.valueOf(initOpenViduRequest.getCustomSessionId()));

    Map<String, Object> params = new LinkedHashMap<>();
    params.put("customSessionId", initOpenViduRequest.getCustomSessionId());

    SessionProperties properties = SessionProperties.fromJson(params).build();
    Session session = openvidu.createSession(properties);
    return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
  }

  /**
   * @param sessionId The Session in which to create the Connection
   * @param params    The Connection properties
   * @return The Token associated to the Connection
   */
  @PostMapping("{sessionId}/connections")
  public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
      @RequestBody(required = false) Map<String, Object> params)
      throws OpenViduJavaClientException, OpenViduHttpException {
    Session session = openvidu.getActiveSession(sessionId);
    if (session == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
    Connection connection = session.createConnection(properties);

    System.out.println(connection.getToken());
    return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
  }

  @DeleteMapping
  public ResponseEntity<?> deleteSession() {

    memberService.deleteTeacherClassId(SecurityUtil.getLoginUserId());

    return createSuccessResponse(SuccessCode.DELETE_SUCCESS, "강사의 classId를 해제하였습니다.");

  }

  // 알람을 받으면 바로 connections 실행할 수 있게 해주면 됨, 이거 써야됨 위에꺼는 openvidu랑 연결 잘되는지 확인할려고 쓰고 있음
//    /**
//     * @return The Token associated to the Connection
//     */
//    @PostMapping("/connections")
//    public ResponseEntity<String> createConnection()
//            throws OpenViduJavaClientException, OpenViduHttpException {
//
//        Long sessionId = memberService.getClassId(SecurityUtil.getLoginUserId());
//
//        Session session = openvidu.getActiveSession(String.valueOf(sessionId));
//        if (session == null) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//        Connection connection = session.createConnection();
//
//        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
//    }

}
