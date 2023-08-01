import React from 'react';
import './Banner.css';

const Banner = () => {
    return (
    <header
        className='banner'
        style={{
        backgroundImage: 'url(/images/BG_image.png)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        }}>
        <div className='banner__contents'>
            <h1 className='banner__title'>
             배움에 대한 기쁨은 나누고 배움의 열정을 더하다
            </h1>
            <p className='banner__description'>
                주경야학과 함께라면, 언제 어디서든 야학 봉사가 가능합니다!
            </p>
        </div>
        <div className='banner--fadeBottom' /> 
    </header>
    )
}


export default Banner
