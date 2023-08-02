import { useEffect, useState } from "react";

export const useDebounce = (value, delay) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value)
        }, delay); // 밸류가 디바운스 함수에 들어가면 delay만큼 시간을 기다리게 하는데
    
      return () => { // 첫번째 입력후 끝나면 상관없지만 두번째 입력이 들어오면 또 다시 setTimeout으로 시간을 설정하니까
        clearTimeout(handler) // 두번째가 들어오면 클리어로 시간을 날리고 다시 설정
      }  // 그니까 처음에 들어올때도 클리어로 시간을 날려버리고 다시 설정 두번째 들어와도 시간 날리고 다시 설정
    }, [value, delay])

    return debounceValue
}