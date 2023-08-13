import React, { useCallback, useState, useEffect } from "react";
import styles from "./StudentNote.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import { setNote } from "../../store/actions/setNoteAction";
import { fetchTheme } from "../../store/actions/themeAction";

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

  useEffect(() => {
    dispatch(fetchTheme());
  }, [dispatch]);

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>공책이 있으신가요?</b>
          <TTSsentence message="공책이 있으신가요?" />
          <div className={styles.buttonContainer}>
            <button className={styles.clearButton} onClick={handleNoteYes}>
              있어요
            </button>
            <button className={styles.downloadButton} onClick={handleNoteNo}>
              없어요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
