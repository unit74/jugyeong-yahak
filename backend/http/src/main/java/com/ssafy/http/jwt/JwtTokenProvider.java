package com.ssafy.http.jwt;

import com.ssafy.http.jwt.dtos.TokenDto;
import com.ssafy.http.redis.services.RedisService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider implements InitializingBean {

  private final UserDetailsService userDetailsService;
  private final RedisService redisService;
  private static final String ID_KEY = "identification";
  private static final String AUTHORITIES_KEY = "role";

  @Value("${jwt.secret.key}")
  private String secretKey;
  private static Key signingKey;

  @Value("${jwt.valid-time.access}")
  private Long accessTokenValidTime;// 30 minutes

  @Value("${jwt.valid-time.refresh}")
  private Long refreshTokenValidTime;// 1 week

  @Override
  public void afterPropertiesSet() throws Exception {
    secretKey = Base64.getEncoder()
        .encodeToString(secretKey.getBytes());

    byte[] secretKeyBytes = Decoders.BASE64.decode(secretKey);
    signingKey = Keys.hmacShaKeyFor(secretKeyBytes);
  }

  @Transactional
  public TokenDto createToken(String identification, String authorities) {
    Long now = System.currentTimeMillis();

    String accessToken = Jwts.builder()
        .setHeaderParam("typ", "JWT")
        .setHeaderParam("alg", "HS512")
        .setExpiration(new Date(now + accessTokenValidTime))
        .setSubject("access-token")
        .claim(ID_KEY, identification)
        .claim(AUTHORITIES_KEY, authorities)
        .signWith(signingKey, SignatureAlgorithm.HS512)
        .compact();

    String refreshToken = Jwts.builder()
        .setHeaderParam("typ", "JWT")
        .setHeaderParam("alg", "HS512")
        .setExpiration(new Date(now + refreshTokenValidTime))
        .setSubject("refresh-token")
        .signWith(signingKey, SignatureAlgorithm.HS512)
        .compact();

    return new TokenDto(accessToken, refreshToken);
  }

  public Claims getClaims(String token) {
    try {
      return Jwts.parserBuilder()
          .setSigningKey(signingKey)
          .build()
          .parseClaimsJws(token)
          .getBody();
    } catch (ExpiredJwtException e) { // Access Token
      return e.getClaims();
    }
  }

  public Authentication getAuthentication(String token) {
    
    String identification = getClaims(token).get(ID_KEY)
        .toString();

    System.out.println(" ============> getAuth에서 identification : " + identification);

    String st = " ";

    String role = getClaims(token).get(AUTHORITIES_KEY).toString();
    System.out.println(" ============> getAuth에서 role : " + role);

    String res = identification + st + role;
    System.out.println(" ============> getAuth에서 res : " + res);

    UserDetails userDetails = userDetailsService.loadUserByUsername(res);
    return new UsernamePasswordAuthenticationToken(userDetails, "",
        userDetails.getAuthorities());
  }

  public String getUserEmail(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(signingKey)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public long getTokenExpirationTime(String token) {
    return getClaims(token).getExpiration()
        .getTime();
  }

  public boolean validateRefreshToken(String refreshToken) {
    try {
      if (redisService.getValues(refreshToken)
          .equals("delete")) { // 회원 탈퇴했을 경우
        return false;
      }
      Jwts.parserBuilder()
          .setSigningKey(signingKey)
          .build()
          .parseClaimsJws(refreshToken);
      return true;
    } catch (SignatureException e) {
      log.error("Invalid JWT signature.");
    } catch (MalformedJwtException e) {
      log.error("Invalid JWT token.");
    } catch (ExpiredJwtException e) {
      log.error("Expired JWT token.");
    } catch (UnsupportedJwtException e) {
      log.error("Unsupported JWT token.");
    } catch (IllegalArgumentException e) {
      log.error("JWT claims string is empty.");
    } catch (NullPointerException e) {
      log.error("JWT Token is empty.");
    }
    return false;
  }

  public boolean validateAccessToken(String accessToken) {
    try {
      if (redisService.getValues(accessToken) != null // NPE 방지
          && redisService.getValues(accessToken)
          .equals("logout")) { // 로그아웃 했을 경우
        return false;
      }
      Jwts.parserBuilder()
          .setSigningKey(signingKey)
          .build()
          .parseClaimsJws(accessToken);
      return true;
    } catch (ExpiredJwtException e) {
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public boolean validateAccessTokenOnlyExpired(String accessToken) {
    try {
      return getClaims(accessToken).getExpiration()
          .before(new Date());
    } catch (ExpiredJwtException e) {
      return true;
    } catch (Exception e) {
      return false;
    }
  }

}