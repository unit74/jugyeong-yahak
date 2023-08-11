// // useCanvasLogic.js
// import { useRef, useState, useEffect } from "react";
// import html2canvas from "html2canvas";


// export default function useCanvasLogic(handleStudentAnswer) {
//     const canvasRef = useRef(null); 
//     const [studentAns, setStudentAns] = useState(""); 

//     // 그림 지우기 로직
//     const handleClear = () => {
//         if (canvasRef.current) {
//             canvasRef.current.clear();
//         }
//     };

//     // 그림 캡쳐 및 OCR 로직
//     const handleDownload = async () => {
//         if (canvasRef.current) {
//             const canvas = await html2canvas(canvasRef.current.canvasContainer);
//       const base64Image = canvas.toDataURL("image/png");
//       setDrawData(canvasRef.current.getSaveData());

//             // 응답받은 단어를 StudentAns에 저장
//             vision.annotate(req).then(
//                 (res) => {
//                     const answer = res.responses[0]["textAnnotations"][0]["description"];
//                     setStudentAns(answer);
//                     handleStudentAnswer(answer);
//                 },
//                 (e) => {
//                     console.log("Error: ", e);
//                 }
//             );
//         }
//     };

//     return { canvasRef, handleClear, handleDownload, studentAns };
// }
