package com.ssafy.http.apis.diaries.services;

import com.ssafy.http.apis.diaries.entities.DiaryEntity;
import com.ssafy.http.apis.diaries.repositories.DiaryRepository;
import com.ssafy.http.apis.diaries.requests.DiaryRegisterRequest;
import com.ssafy.http.apis.diaries.responses.DiaryDetailResponse;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.members.services.S3ImageUploadService;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.support.codes.ErrorCode;
import com.twelvemonkeys.imageio.plugins.webp.WebPImageReaderSpi;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.spi.IIORegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


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

  public void registerDiary(Long loginUserId, DiaryRegisterRequest diaryRegisterRequest) {

    String folder = "diary/" + loginUserId;
    String fileName = UUID.randomUUID().toString();
    System.out.println("===> fileName : " + fileName);
    String imageUrl = url + folder + "/" + fileName + imageType;

    String tempUrl = diaryRegisterRequest.getImageUrl();

    try {
      // Register the WebP ImageReaderSpi
      ImageIO.scanForPlugins();

      IIORegistry registry = IIORegistry.getDefaultInstance();

      // WebP 이미지 리더를 등록
      registry.registerServiceProvider(new WebPImageReaderSpi());

      // Read the WebP image
      URL url = new URL(tempUrl);
      BufferedImage image = readWebPImage(url);
      File file = new File("diary/" + fileName);

      ImageIO.write(image, "png", file);

      //folder, uuid, fileType, uploadFile
      s3ImageUploadService.upload(folder, fileName, imageType, file);


    } catch (Exception e) {
      System.out.println("에러발생에러발생");
      throw new RuntimeException(e);
    }
//    try {
//      s3ImageUploadService.uploadImage(folder, fileName, imageType, imageData);
//    } catch (IOException e) {
//      throw new RegisterIdentificationException(ErrorCode.IO_ERROR);
//    }

    System.out.println("===> imageUrl : " + imageUrl);

    MemberEntity memberEntity = memberRepository.findMemberEntityById(loginUserId).orElseThrow(
        () -> new CustomException(ErrorCode.ID_NOTFOUND)
    );

    DiaryEntity diaryEntity = diaryRegisterRequest.toEntity(memberEntity, imageUrl);

    diaryRepository.save(diaryEntity);
  }

  //webp 관련 추가된 메서드
  public static BufferedImage readWebPImage(URL url) throws IOException {
    // Get all available readers that can read WebP format
    Iterator<ImageReader> readers = ImageIO.getImageReadersByFormatName("webp");

    if (readers.hasNext()) {
      ImageReader reader = readers.next();
      reader.setInput(ImageIO.createImageInputStream(url.openStream()));

      return reader.read(0);
    }

    return null;
  }
}