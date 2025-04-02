import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import ProductList from '../../../components/Customer/Product-List/ProductList';
import ProductRecommender from '../../../components/Customer/Product-Recommender/ProductRecommender';
import Contact from '../../../components/Customer/Contact/Contact';
import Category from '../../../components/Customer/Category/Category';
import Cart from '../../../components/Customer/Cart/Cart';
import { getCategoryId, setDisplayToast } from '../../../actions/user';

import './home.scss';

function Home(props) {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
    const dispatch = useDispatch();
    const isToast = useSelector(state => state.user.isToast);

    const fetchCategory = async () => {
        const response = await fetch('/api/category/');
        const data = await response.json();

        if (data) {
            const categoryActive = data.filter((item) => item.is_active);
            if (categoryActive.length > 0) setCategories(categoryActive);

            const categoryFirst = data.find((item) => {
                if (item.is_active) return item.id;
            });

            const action = getCategoryId(categoryFirst.id);
            dispatch(action);
        }
    };

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('/api/product');
            const products = await response.json();

            if (products && Array.isArray(products)) {
                const featured = products.filter(p => p.is_featured === true || p.is_active === true);
                setFeaturedProducts(featured);
            }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm nổi bật:', error);
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchFeaturedProducts();
    }, []);

    useEffect(() => {
        if (isToast) {
            toast.success('Sản phẩm thêm vào giỏ');
            dispatch(setDisplayToast(!isToast));
        }
    }, [isToast]);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
            />
            <Cart accessToken={accessToken} />
            <Container className='block-product'>
                {accessToken && (
                    <>
                        <h2>Gợi ý cho bạn</h2>
                        <ProductRecommender accessToken={accessToken} />
                    </>
                )}

                <h2>Nổi bật hôm nay</h2>
                {/* Dữ liệu products được lấy từ backend và lọc nổi bật */}
                <ProductList products={featuredProducts} />

                <Contact />
            </Container>
        </>
    );
}

export default Home;
