package com.ssafy.http.apis.auth.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.ssafy.http.exception.RegisterIdentificationException;
import com.ssafy.http.support.codes.ErrorCode;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FaceLoginService {

  public String faceLogin(MultipartFile faceImage, Long governmentId, String[] labels) {

    File uploadFile = null;
    try {
      uploadFile = convert(faceImage)
          .orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File 전환 실패"));
    } catch (IOException e) {
      new RegisterIdentificationException(
          ErrorCode.IO_ERROR);
    }

    LinkedMultiValueMap<String, Object> params = new LinkedMultiValueMap<>();

    params.add("labels", labels);
    params.add("face", uploadFile);
    params.add("folder", governmentId);

    HttpHeaders headers = new HttpHeaders();

    headers.setContentType(MediaType.MULTIPART_FORM_DATA);

    HttpEntity<LinkedMultiValueMap<String, Object>> request
        = new HttpEntity<>(params, headers);

    String nodeUrl = "http://localhost:3000/check-face";

    RestTemplate rest = new RestTemplate();

    //ByteArray 대신 서버의 이미지 주소를 보내는 로직으로 변경
    //rest.getMessageConverters().add(new ByteArrayHttpMessageConverter());

    ResponseEntity<JsonNode> postForEntity
        = rest.postForEntity(nodeUrl, request, JsonNode.class);

    removeNewFile(uploadFile);

    System.out.println(postForEntity.getBody().get("result").get(0).get("_label").asText());
    System.out.println(postForEntity.getBody().get("result").get(0).get("_distance").asDouble());

    return postForEntity.getBody().get("result").get(0).get("_label").asText();

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

  private void removeNewFile(File targetFile) {
    if (targetFile.delete()) {
      //log.info("파일이 삭제되었습니다.");
      System.out.println("파일 삭제되었습니다.");
    } else {
      //log.info("파일이 삭제되지 못했습니다.");
      System.out.println("파일 삭제되지 않음");
    }
  }
}
