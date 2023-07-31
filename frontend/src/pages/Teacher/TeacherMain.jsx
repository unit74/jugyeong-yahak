import styles from "./i-pad-pro117.module.css";

const IPadPro117 = () => {
  return (
    <div className={styles.ipadPro117}>
      <header className={styles.header}>
        <b>김나연 봉사자님</b>
        <img
          className={styles.arcticonskanjiStudy}
          alt=""
          src="/arcticonskanjistudy.svg"
        />
        <span>주경야학</span>
        <button className={styles.logout}>Logout</button>
      </header>
      <img className={styles.bannerImage} alt="" src="/rectangle-4220@2x.png" />
      <section className={styles.welcome}>
        <b>👋🏻 김나연 님, 안녕하세요!</b>
        <span>주경야학과 함께라면, 언제 어디서든 야학 봉사가 가능합니다!</span>
      </section>
      <section className={styles.question}>
        <p>
          어떤 <span className={styles.emphasis}>업무</span>를 도와드릴까요?
        </p>
      </section>
      <section className={styles.options}>
        <article className={styles.option}>
          <div className={styles.optionImage}></div>
          <div className={styles.optionText}>
            <p>실시간 수업</p>
            <p>시작하기</p>
          </div>
          <img
            className={styles.optionIcon}
            alt=""
            src="/twemojiwomanteacher.svg"
          />
        </article>
        <article className={styles.option}>
          <div className={styles.optionImage}></div>
          <div className={styles.optionText}>
            <p>학생 정보</p>
            <p>확인하기</p>
          </div>
          <img className={styles.optionIcon} alt="" src="/group-2175.svg" />
        </article>
        <article className={styles.option}>
          <div className={styles.optionImage}></div>
          <div className={styles.optionText}>
            <p>학생 진도율</p>
            <p>확인하기</p>
          </div>
          <img className={styles.optionIcon} alt="" src="/group-2176.svg" />
        </article>
      </section>
    </div>
  );
};

export default IPadPro117;
