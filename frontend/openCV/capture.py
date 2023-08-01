# pip install opencv-python
import cv2
 
webcam = cv2.VideoCapture(0)

#-- 웹캠 오류 처리 
if not webcam.isOpened():
    print("WebCam is not running")
    exit()
    
 
time_num= 0    
image_num = 0
    
#-- 웹캠 열기
while webcam.isOpened():
    
     
    status, frame = webcam.read()
    time_num = time_num + 1
    
    if not status:
        break
 
    #-- 출력창
    cv2.imshow("WebCam", frame)
    
    #-- 캡쳐 프레임 간격 설정
    if time_num == 30:
        image_num = image_num + 1
        cv2.imwrite('img'+str(image_num)+'.png', frame) #-- 본인 편의에 맞게 경로 설정 및 이미지 이름 변경
        time_num = 0
        
    
    #-- q 입력시 종료 
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
webcam.release()
cv2.destroyAllWindows()