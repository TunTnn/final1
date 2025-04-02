import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './banner.scss';
import bannerImg from '../../../assets/img/banner.png';
import { Container } from 'react-bootstrap';

function Banner(props) {
    const { isDisplay } = props;
    const [key, setKey] = useState('');
    const navigate = useNavigate();

    const handleSubmitSearch = (event) =>{
        event.preventDefault();
        if(key === '') return;
        navigate(`/search?key=${key}`);
    }

    if (isDisplay) {
        return (
            <div className='banner'>
                <Container>
                    <div className='banner__content'>
                        <h2 className='banner__content__title'>
                            Thử ngay các món ăn trên TBayEAT
                        </h2>
                        <div className='banner__content__desc'>
                            Đặt món trên TBayEAT để cảm nhận dịch vụ tiện ích mà chúng tôi mang lại cho bạn những món ăn ngon hấp dẫn.
                        </div>
                        <div className='banner__content__search-box'>
                            <form onSubmit={(event)=>handleSubmitSearch(event)}>
                                <input type='text' onChange={(event)=>setKey(event.target.value)} value={key} name='key' placeholder='Tìm kiếm món ăn yêu thích'/>
                                <button className='banner__content__btn search-btn'>Tìm kiếm</button>
                            </form>
                        </div>
                    </div>
                    <div className='banner__image'>
                        <img src={bannerImg} alt='' title='' />
                    </div>
                </Container>
            </div>
        );
    } else {
        return (
            <></>
        );
    }
}

export default Banner;