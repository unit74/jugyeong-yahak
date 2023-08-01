package com.ssafy.http.apis.members.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.URISyntaxException;


@Service
public class MemberService {

    public String memberLogin(MultipartFile faceImage, String government) throws URISyntaxException {

        LinkedMultiValueMap<String, Object> params = new LinkedMultiValueMap<>();

        //String[] labels = new String[1];
        //labels[0] = "lee";

        //params.add("labels", labels);
        params.add("face-image", faceImage);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<LinkedMultiValueMap<String, Object>> request
                = new HttpEntity<>(params, headers);

        String nodeUrl = "http://localhost:3000/check-face";

        RestTemplate rest = new RestTemplate();

        ResponseEntity<JsonNode> postForEntity
                = rest.postForEntity(nodeUrl, request, JsonNode.class);

        System.out.println(postForEntity.getStatusCodeValue());
        System.out.println(postForEntity.getBody());
        System.out.println(postForEntity.getHeaders());

        return "hello";

    }
}
