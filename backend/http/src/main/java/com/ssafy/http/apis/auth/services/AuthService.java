package com.ssafy.http.apis.auth.services;

import com.ssafy.http.apis.auth.dtos.MemberLoginDto;
import com.ssafy.http.apis.auth.requests.GovernmentLoginRequest;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.jwt.JwtTokenProvider;
import com.ssafy.http.jwt.dtos.TokenDto;
import com.ssafy.http.redis.services.RedisService;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final JwtTokenProvider jwtTokenProvider;
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final RedisService redisService;
  private final FaceLoginService faceLoginService;
  private final MemberRepository memberRepository;

  private final String SERVER = "Server";

  @Transactional //회원 로그인
  public MemberLoginDto memberLogin(MultipartFile loginImage, Long governmentId) {

    List<MemberEntity> members = memberRepository.findUuidByGovernmentId(
        governmentId);//uuid 리스트 가져오기
    String[] labels = new String[members.size()];

    for (int i = 0; i < members.size(); i++) {
      labels[i] = members.get(i).getUuid(); //UUID list
    }

    //사용자 이미지 파일, S3의 디렉토리, 파일명
    String uuid = faceLoginService.faceLogin(loginImage, governmentId, labels);

    //UUID로 MemberEntity
    MemberEntity member = memberRepository.findMemberEntityByUuid(uuid).orElseThrow(
        () -> new IllegalArgumentException("사람을 찾지 못했습니다"));

    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(
            member.getId() + " " + member.getRole().getRole(),
            member.getUuid());

    Authentication authentication = authenticationManagerBuilder.getObject()
        .authenticate(authenticationToken);

    SecurityContextHolder.getContext().setAuthentication(authentication);

    //응답 객체 생성
    MemberLoginDto loginDto = new MemberLoginDto();
    loginDto.of(
        generateToken(SERVER, authentication.getName(), getAuthorities(authentication)), member);

    return loginDto;
  }

  @Transactional //지자체 로그인
  public TokenDto login(GovernmentLoginRequest governmentLoginRequest) {
    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(
            governmentLoginRequest.getIdentification() + " " + "ROLE_GOVERNMENT",
            governmentLoginRequest.getPassword());

    Authentication authentication = authenticationManagerBuilder.getObject()
        .authenticate(
            authenticationToken);
    SecurityContextHolder.getContext()
        .setAuthentication(authentication);

    return generateToken(SERVER, authentication.getName(), getAuthorities(authentication));
  }

  // AT가 만료일자만 초과한 유효한 토큰인지 검사
  public boolean validate(String requestAccessTokenInHeader) {
    String requestAccessToken = resolveToken(requestAccessTokenInHeader);
    return jwtTokenProvider.validateAccessTokenOnlyExpired(requestAccessToken); // true = 재발급
  }

  // 토큰 재발급: validate 메서드가 true 반환할 때만 사용 -> AT, RT 재발급
  @Transactional
  public TokenDto reissue(String requestAccessTokenInHeader, String requestRefreshToken) {
    String requestAccessToken = resolveToken(requestAccessTokenInHeader);

    Authentication authentication = jwtTokenProvider.getAuthentication(requestAccessToken);
    String principal = getPrincipal(requestAccessToken);

    String refreshTokenInRedis = redisService.getValues("RT(" + SERVER + "):" + principal);
    if (refreshTokenInRedis == null) { // Redis에 저장되어 있는 RT가 없을 경우
      return null; // -> 재로그인 요청
    }

    // 요청된 RT의 유효성 검사 & Redis에 저장되어 있는 RT와 같은지 비교
    if (!jwtTokenProvider.validateRefreshToken(requestRefreshToken)
        || !refreshTokenInRedis.equals(requestRefreshToken)) {
      redisService.deleteValues("RT(" + SERVER + "):" + principal); // 탈취 가능성 -> 삭제
      return null; // -> 재로그인 요청
    }

    SecurityContextHolder.getContext()
        .setAuthentication(authentication);
    String authorities = getAuthorities(authentication);

    // 토큰 재발급 및 Redis 업데이트
    redisService.deleteValues("RT(" + SERVER + "):" + principal); // 기존 RT 삭제
    TokenDto tokenDto = jwtTokenProvider.createToken(principal, authorities);
    saveRefreshToken(SERVER, principal, tokenDto.getRefreshToken());
    return tokenDto;
  }

  // 토큰 발급
  @Transactional
  public TokenDto generateToken(String provider, String email, String authorities) {
    // RT가 이미 있을 경우
    if (redisService.getValues("RT(" + provider + "):" + email) != null) {
      redisService.deleteValues("RT(" + provider + "):" + email); // 삭제
    }

    // AT, RT 생성 및 Redis에 RT 저장
    TokenDto tokenDto = jwtTokenProvider.createToken(email, authorities);
    saveRefreshToken(provider, email, tokenDto.getRefreshToken());
    return tokenDto;
  }

  // RT를 Redis에 저장
  @Transactional
  public void saveRefreshToken(String provider, String principal, String refreshToken) {
    redisService.setValuesWithTimeout("RT(" + provider + "):" + principal, // key
        refreshToken, // value
        jwtTokenProvider.getTokenExpirationTime(refreshToken)); // timeout(milliseconds)
  }

  // 권한 이름 가져오기
  public String getAuthorities(Authentication authentication) {
    return authentication.getAuthorities()
        .stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(","));
  }

  // AT로부터 principal 추출
  public String getPrincipal(String requestAccessToken) {
    return jwtTokenProvider.getAuthentication(requestAccessToken)
        .getName();
  }

  // "Bearer {AT}"에서 {AT} 추출
  public String resolveToken(String requestAccessTokenInHeader) {
    if (requestAccessTokenInHeader != null && requestAccessTokenInHeader.startsWith(
        "Bearer ")) {
      return requestAccessTokenInHeader.substring(7);
    }
    return null;
  }

  // 로그아웃
  @Transactional
  public void logout(String requestAccessTokenInHeader) {
    String requestAccessToken = resolveToken(requestAccessTokenInHeader);
    String principal = getPrincipal(requestAccessToken);

    // Redis에 저장되어 있는 RT 삭제
    String refreshTokenInRedis = redisService.getValues("RT(" + SERVER + "):" + principal);
    if (refreshTokenInRedis != null) {
      redisService.deleteValues("RT(" + SERVER + "):" + principal);
    }

    // Redis에 로그아웃 처리한 AT 저장
    long expiration =
        jwtTokenProvider.getTokenExpirationTime(requestAccessToken) - new Date().getTime();
    redisService.setValuesWithTimeout(requestAccessToken,
        "logout",
        expiration);
  }
}
