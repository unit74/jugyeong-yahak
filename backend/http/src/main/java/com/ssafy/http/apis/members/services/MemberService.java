package com.ssafy.http.apis.members.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;


@Service
public class MemberService {

    public String memberLogin(MultipartFile faceImage, String government) throws URISyntaxException, IOException {

        File uploadFile = convert(faceImage)
                .orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File 전환 실패"));


        LinkedMultiValueMap<String, Object> params = new LinkedMultiValueMap<>();

        String[] labels = new String[1];
        labels[0] = "lee";

        params.add("labels", labels);
        //params.add("Face", faceImage);
        params.add("Face", uploadFile);


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<LinkedMultiValueMap<String, Object>> request
                = new HttpEntity<>(params, headers);

        String nodeUrl = "http://localhost:3000/check-face";

        RestTemplate rest = new RestTemplate();

        //이거 추가?
        //rest.getMessageConverters().add(new ByteArrayHttpMessageConverter());

        ResponseEntity<JsonNode> postForEntity
                = rest.postForEntity(nodeUrl, request, JsonNode.class);

        removeNewFile(uploadFile);

        //System.out.println(postForEntity.getStatusCodeValue());

        System.out.println(postForEntity.getBody().get("result").get(0).get("_label").asText());
        System.out.println(postForEntity.getBody().get("result").get(0).get("_distance").asDouble());
        //{"result":[{"_label":"lee","_distance":0.3462712649992261}]}
        System.out.println(postForEntity.getHeaders());

        return "hello";

    }

    private Optional<File> convert(MultipartFile file) throws IOException {

        File convertFile = new File(file.getOriginalFilename());

        if (convertFile.createNewFile()) {
            try (FileOutputStream fos = new FileOutputStream(convertFile)) { // FileOutputStream 데이터를 파일에 바이트 스트림으로 저장하기 위함
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }

        return Optional.empty();
    }

    private void removeNewFile(File targetFile) {
        if(targetFile.delete()) {
            //log.info("파일이 삭제되었습니다.");
            System.out.println("파일 삭제되었습니다.");
        }else {
            //log.info("파일이 삭제되지 못했습니다.");
            System.out.println("파일 삭제되지 않음");
        }
    }
}
