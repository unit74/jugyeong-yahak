import React, { useCallback, useState, useEffect } from "react";
import styles from "./StudentMain.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import { setNote } from "../../store/actions/setNoteAction";  

export default function StudentNote() {
    const [fade, setFade] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNoteYes = useCallback(() => {
        dispatch(setNote(true)); 
        setFade(true);
        setTimeout(() => {
            navigate("/review-theme");
        }, 1000); // fadeout 후 이동
    }, [navigate, dispatch]);

    const handleNoteNo = useCallback(() => {
        dispatch(setNote(false)); 
        setFade(false);
        setTimeout(() => {
            navigate("/review-theme");
        }, 1000); // fadeout 후 이동
    }, [navigate, dispatch]);

        
  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
        <TTSsentence message='공책이 있으신가요?' />
          <button onClick={handleNoteYes}>있어요</button>
          <button onClick={handleNoteNo}>없어요</button>
        </div>
      </div>
    </div>
  );
}
