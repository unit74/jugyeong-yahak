package com.ssafy.http.apis.members.services;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class S3ImageUploadService {

  private final AmazonS3Client amazonS3Client;

  @Value("${cloud.aws.s3.bucket}")
  private String bucket;

  // MultipartFile을 전달받아 File로 전환한 후 S3에 업로드
  public String uploadImage(String folder, String uuid, String fileType, MultipartFile faceImage)
      throws IOException {
    File uploadFile = convert(faceImage)
        .orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File 전환 실패"));

    return upload(folder, uuid, fileType, uploadFile);
  }

  public String upload(String folder, String uuid, String fileType, File uploadFile) {

    String fileName = folder + "/" + uuid + fileType;

    String uploadImageUrl = putS3(uploadFile, fileName);

    removeNewFile(uploadFile);  // 로컬에 생성된 File 삭제 (MultipartFile -> File 전환 하며 로컬에 파일 생성됨)

    return uploadImageUrl;      // 업로드된 파일의 S3 URL 주소 반환
  }

  private String putS3(File uploadFile, String fileName) {
    amazonS3Client.putObject(
        new PutObjectRequest(bucket, fileName, uploadFile)
            .withCannedAcl(CannedAccessControlList.PublicRead)  // PublicRead 권한으로 업로드 됨
    );
    return amazonS3Client.getUrl(bucket, fileName).toString();
  }

  private void removeNewFile(File targetFile) {
    if (targetFile.delete()) {
      //log.info("파일이 삭제되었습니다.");
      System.out.println("파일 삭제되었습니다.");
    } else {
      //log.info("파일이 삭제되지 못했습니다.");
      System.out.println("파일 삭제되지 않음");
    }
  }

  private Optional<File> convert(MultipartFile file) throws IOException {

    File convertFile = new File(file.getOriginalFilename());

    if (convertFile.createNewFile()) {
      try (FileOutputStream fos = new FileOutputStream(
          convertFile)) { // FileOutputStream 데이터를 파일에 바이트 스트림으로 저장하기 위함
        fos.write(file.getBytes());
      }
      return Optional.of(convertFile);
    }

    removeNewFile(convertFile);

    return Optional.empty();
  }
}
