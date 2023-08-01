// 이미지 base64 인코딩
import React, { useEffect, useState } from 'react';

const CallGoogleVisionApi = () => {
  const [base64Image, setBase64Image] = useState('');

  useEffect(() => {
    // 이미지 파일을 가져와서 Base64로 인코딩하는 함수
    const getBase64Image = async () => {
      const response = await fetch('./image11.png'); // 이미지 파일 경로 또는 URL
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Base64 데이터 추출
        setBase64Image(base64String);
      };
      reader.readAsDataURL(blob);
    };

    // 함수 호출
    getBase64Image();
  }, []);

  return (
      console.log({base64Image})
  );
};

export default CallGoogleVisionApi;

// 구글 Vision API 요청

// 결과 저장