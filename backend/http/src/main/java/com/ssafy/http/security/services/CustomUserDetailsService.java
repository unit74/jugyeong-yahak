package com.ssafy.http.security.services;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import com.ssafy.http.apis.governments.repositories.GovernmentRepository;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import java.util.StringTokenizer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final GovernmentRepository governmentRepository;
  private final MemberRepository memberRepository;

  @Override
  public UserDetails loadUserByUsername(String identification)
      throws UsernameNotFoundException {

    StringTokenizer st = new StringTokenizer(identification);

    String id = st.nextToken();
    String role = "";

    if (st.hasMoreTokens()) {
      role = st.nextToken();
    }

    if (role.equals("ROLE_GOVERNMENT")) {
      GovernmentEntity findUser = governmentRepository.findByIdentification(
              (id))
          .orElseThrow(
              () -> new UsernameNotFoundException(
                  "Can't find user with this email. -> "
                      + id));
      if (findUser != null) {
        CustomUserDetails customUserDetails = new CustomUserDetails(findUser);
        return customUserDetails;
      }

    } else {
      MemberEntity findUser = memberRepository.findMemberEntityById(
              Long.parseLong(id))
          .orElseThrow(
              () -> new UsernameNotFoundException(
                  "Can't find user with this email. -> "
                      + id));

      if (findUser != null) {
        CustomUserDetails customUserDetails = new CustomUserDetails(findUser);
        return customUserDetails;
      }
    }

    return null;
  }
}