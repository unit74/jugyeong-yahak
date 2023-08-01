import { useEffect } from "react"

export default function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            // console.log("event.target", event.target)
            if(!ref.current || ref.current.contains(event.target)) { // event.target가 ref가 안에 존재하니까
                return;
            }
            handler();
        };
        
        document.addEventListener("mousedown", listener);  // 마우스 클릭
        document.addEventListener("touchstart", listener); // 모바일에서 손으로 터치
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      }
    }, [ref, handler]) // 디펜던시에다가 ref나 handler가 바뀌면 다시 호출되게 적어줌
    
}
// 모달 창 밖을 클릭했을 때 모달창 닫기