package com.ssafy.http.apis.auth.services;

import com.ssafy.http.apis.auth.requests.GovernmentLoginRequest;
import com.ssafy.http.jwt.JwtTokenProvider;
import com.ssafy.http.jwt.dtos.TokenDto;
import com.ssafy.http.redis.services.RedisService;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final RedisService redisService;

    private final String SERVER = "Server";

    @Transactional
    public TokenDto login(GovernmentLoginRequest governmentLoginRequest) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            governmentLoginRequest.getIdentification(), governmentLoginRequest.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject()
                                                                    .authenticate(
                                                                        authenticationToken);
        SecurityContextHolder.getContext()
                             .setAuthentication(authentication);

        return generateToken(SERVER, authentication.getName());
    }

    public boolean validate(String requestAccessTokenInHeader) {
        String requestAccessToken = resolveToken(requestAccessTokenInHeader);
        return jwtTokenProvider.validateAccessTokenOnlyExpired(requestAccessToken);
    }

    @Transactional
    public TokenDto reissue(String requestAccessTokenInHeader, String requestRefreshToken) {
        String requestAccessToken = resolveToken(requestAccessTokenInHeader);

        Authentication authentication = jwtTokenProvider.getAuthentication(requestAccessToken);
        String principal = getPrincipal(requestAccessToken);

        String refreshTokenInRedis = redisService.getValues("RT(" + SERVER + "):" + principal);
        if (refreshTokenInRedis == null) {
            return null;
        }

        if (!jwtTokenProvider.validateRefreshToken(requestRefreshToken)
            || !refreshTokenInRedis.equals(requestRefreshToken)) {
            redisService.deleteValues("RT(" + SERVER + "):" + principal);
            return null;
        }

        SecurityContextHolder.getContext()
                             .setAuthentication(authentication);

        redisService.deleteValues("RT(" + SERVER + "):" + principal);
        TokenDto tokenDto = jwtTokenProvider.createToken(principal);
        saveRefreshToken(SERVER, principal, tokenDto.getRefreshToken());
        return tokenDto;
    }

    @Transactional
    public TokenDto generateToken(String provider, String email) {
        if (redisService.getValues("RT(" + provider + "):" + email) != null) {
            redisService.deleteValues("RT(" + provider + "):" + email);
        }

        TokenDto tokenDto = jwtTokenProvider.createToken(email);
        saveRefreshToken(provider, email, tokenDto.getRefreshToken());
        return tokenDto;
    }

    @Transactional
    public void saveRefreshToken(String provider, String principal, String refreshToken) {
        redisService.setValuesWithTimeout("RT(" + provider + "):" + principal, refreshToken,
            jwtTokenProvider.getTokenExpirationTime(refreshToken));
    }

    public String getPrincipal(String requestAccessToken) {
        return jwtTokenProvider.getAuthentication(requestAccessToken)
                               .getName();
    }

    public String resolveToken(String requestAccessTokenInHeader) {
        if (requestAccessTokenInHeader != null && requestAccessTokenInHeader.startsWith(
            "Bearer ")) {
            return requestAccessTokenInHeader.substring(7);
        }
        return null;
    }

    @Transactional
    public void logout(String requestAccessTokenInHeader) {
        String requestAccessToken = resolveToken(requestAccessTokenInHeader);
        String principal = getPrincipal(requestAccessToken);

        String refreshTokenInRedis = redisService.getValues("RT(" + SERVER + "):" + principal);
        if (refreshTokenInRedis != null) {
            redisService.deleteValues("RT(" + SERVER + "):" + principal);
        }

        long expiration =
            jwtTokenProvider.getTokenExpirationTime(requestAccessToken) - new Date().getTime();
        redisService.setValuesWithTimeout(requestAccessToken, "logout", expiration);
    }
}
