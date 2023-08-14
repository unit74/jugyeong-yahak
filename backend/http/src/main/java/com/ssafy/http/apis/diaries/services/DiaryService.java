package com.ssafy.http.apis.diaries.services;

import com.ssafy.http.apis.diaries.entities.DiaryEntity;
import com.ssafy.http.apis.diaries.repositories.DiaryRepository;
import com.ssafy.http.apis.diaries.requests.DiaryRegisterRequest;
import com.ssafy.http.apis.diaries.responses.DiaryDetailResponse;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.members.services.S3ImageUploadService;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.exception.RegisterIdentificationException;
import com.ssafy.http.support.codes.ErrorCode;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
@RequiredArgsConstructor
public class DiaryService {

  private final DiaryRepository diaryRepository;
  private final MemberRepository memberRepository;
  private final S3ImageUploadService s3ImageUploadService;

  @Value("${cloud.aws.s3.url}")
  private String url;
  private String imageType = ".png";

  public DiaryDetailResponse getDiary(Long diaryId) {
    DiaryEntity diaryEntity = diaryRepository.findById(diaryId).orElseThrow(
        () -> new CustomException(ErrorCode.NOT_FOUND_ERROR)
    );

    DiaryDetailResponse diaryDetailResponse = new DiaryDetailResponse();
    diaryDetailResponse.of(diaryEntity);

    return diaryDetailResponse;
  }

  public List<DiaryDetailResponse> getDiaries(Long loginUserId) {

    List<DiaryDetailResponse> diaryDetailResponses = new ArrayList<>();

    MemberEntity memberEntity = memberRepository.findMemberEntityById(loginUserId).orElseThrow(
        () -> new CustomException(ErrorCode.ID_NOTFOUND)
    );

    List<DiaryEntity> diaryEntities = diaryRepository.findAllByMemberEntity(memberEntity);

    for (DiaryEntity diaryEntity : diaryEntities) {

      DiaryDetailResponse diaryDetailResponse = new DiaryDetailResponse();
      diaryDetailResponse.of(diaryEntity);
      diaryDetailResponses.add(diaryDetailResponse);
    }
    return diaryDetailResponses;
  }

  public void registerDiary(Long loginUserId, DiaryRegisterRequest diaryRegisterRequest,
      MultipartFile imageData) {

    String folder = "diary/" + loginUserId;
    String fileName = LocalDateTime.now().toString();
    System.out.println("===> fileName : " + fileName);
    String imageUrl = url + folder + "/" + fileName + imageType;
    System.out.println("====> : " + imageUrl);

    try {
      s3ImageUploadService.uploadImage(folder, fileName, imageType, imageData);
    } catch (IOException e) {
      throw new RegisterIdentificationException(ErrorCode.IO_ERROR);
    }

    System.out.println("===> imageUrl : " + imageUrl);

    MemberEntity memberEntity = memberRepository.findMemberEntityById(loginUserId).orElseThrow(
        () -> new CustomException(ErrorCode.ID_NOTFOUND)
    );

    DiaryEntity diaryEntity = diaryRegisterRequest.toEntity(memberEntity, imageUrl);

    diaryRepository.save(diaryEntity);
  }
}
