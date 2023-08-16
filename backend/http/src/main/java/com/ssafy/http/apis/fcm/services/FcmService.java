package com.ssafy.http.apis.fcm.services;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FcmService {

    private final MemberRepository memberRepository;

    public void sendMessage(String token) {

        Message message = Message.builder()
                .putData("title", "실시간 강의")
                .putData("content", "곧 강의가 시작합니다.")
                .setToken(token)
                .build();

        FirebaseMessaging.getInstance().sendAsync(message);
    }

    public void sendMessages(Long class_id) {

        List<MemberEntity> memberEntityList = memberRepository.findAllByClassId(class_id);

        for(MemberEntity memberEntity : memberEntityList) {
//            sendMessage(memberEntity.getToken());   message 보낼 token 필요!! 이거도 레디스??
        }
    }

}
