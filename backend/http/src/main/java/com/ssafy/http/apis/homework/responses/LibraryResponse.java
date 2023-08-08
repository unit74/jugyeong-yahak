package com.ssafy.http.apis.homework.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LibraryResponse {

  private ArrayList<LibraryDetails> list = new ArrayList<>();

  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class LibraryDetails {

    private String themeName;
    private Integer status;
  }

  public void of(List<Object[]> entities) {
    for (Object[] entity : entities) {

      list.add(new LibraryDetails(String.valueOf(entity[0]),
          Integer.valueOf(String.valueOf(entity[1]))));
    }
  }
}
