import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard from '../Product-Card/ProductCard';
import './productRecommender.scss';

function ProductRecommender({accessToken}) {
    const [productsRecommender, setProductsRecommender] = useState([]);
    
    const fetchProductsRecommender = async(accessToken)=>{
        const response = await fetch('/api/product/recommender',{
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        if(data.length > 0) setProductsRecommender(data);
    }

    useEffect(()=>{
        if(accessToken) fetchProductsRecommender(accessToken);
    }, []);

    return (
        <>
            <div className='product__recommender'>
                <Swiper
                    spaceBetween={30}
                    slidesPerView={4}
                    loop={true}
                    rewind={true}
                    speed={1000}
                    autoplay={{
                        delay: 1000,
                        disableOnInteraction: false,
                    }}
                    
                    // navigation={true} 
                    modules={[Autoplay, Navigation]}
                    >
                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            {productsRecommender.length > 0 && productsRecommender.map((product, index)=>{
                                    return(
                                        <SwiperSlide key={index}>
                                            <ProductCard key={index} items={product} fullCol={false}/>
                                        </SwiperSlide>
                                    )
                                })
                            }

                        </div>
                    </div>
                </Swiper>
                {/* <div className="swiper-button-prev">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.6667 9.33335C19.6667 8.81599 19.3674 8.34534 18.8989 8.1259C18.4304 7.90646 17.8772 7.97785 17.4798 8.30905L9.47975 14.9757C9.17576 15.229 9 15.6043 9 16C9 16.3957 9.17576 16.771 9.47975 17.0243L17.4798 23.691C17.8772 24.0222 18.4304 24.0936 18.8989 23.8741C19.3674 23.6547 19.6667 23.184 19.6667 22.6667V9.33335Z" fill="#F3BA00"/>
                        </svg>
                    </div>
                    <div className="swiper-button-nex">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.1869 8.30905C12.7895 7.97785 12.2363 7.90646 11.7678 8.1259C11.2993 8.34534 11 8.81599 11 9.33335V22.6667C11 23.184 11.2993 23.6547 11.7678 23.8741C12.2363 24.0936 12.7895 24.0222 13.1869 23.691L21.1869 17.0243C21.4909 16.771 21.6667 16.3957 21.6667 16C21.6667 15.6043 21.4909 15.229 21.1869 14.9757L13.1869 8.30905Z" fill="#F3BA00"/>
                        </svg>
                    </div> */}
            </div>
        </>
        
    );
}

export default ProductRecommender;