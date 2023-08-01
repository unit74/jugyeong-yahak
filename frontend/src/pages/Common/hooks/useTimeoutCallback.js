import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useTimeoutCallback = (callback, delay) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            callback(navigate);
        }, delay);

        // 언마운트 됐을시 타이머 클리어
        return () => {
            clearTimeout(timer);
        };
    }, [navigate, callback, delay]);
};

export default useTimeoutCallback;
