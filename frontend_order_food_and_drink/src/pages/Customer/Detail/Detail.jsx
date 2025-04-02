import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from "swiper";

import Cart from '../../../components/Customer/Cart/Cart';
import ProductCard from '../../../components/Customer/Product-Card/ProductCard';
import { fetchAddProductToCart, fetchGetCart } from '../../../actions/cart';
import { setCartStore, setCartItems } from '../../../actions/user';
import './detail.scss';
import "swiper/css";
import "swiper/css/navigation";
import pizza from '../../../assets/img/pizza.jpg';

function Detail() {
  const [productItem, setProductItem] = useState(null);
  const [productRelated, setProductRelated] = useState([]);
  const [inputValue, setInputValue] = useState(1);

  const dispatch = useDispatch();
  const inputRef = useRef();

  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));

  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  useEffect(() => {
    if (productItem) {
      fetchProductRelated();
    }
  }, [productItem]);

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`/api/product/${id}`);
      const data = await response.json();

      if (data) {
        setProductItem(data);
      }
    } catch (error) {
      console.error('Error fetching product detail:', error);
    }
  };

  const fetchProductRelated = async () => {
    try {
      const response = await fetch(`/api/product`);
      const products = await response.json();

      if (products && Array.isArray(products)) {
        const filteredProducts = products.filter(p => String(p._id) !== String(id));
        setProductRelated(filteredProducts.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const addProductInCart = async (idProduct) => {  
    if (!user || !accessToken) {
      navigate('/login');
      return;
    }

    const listItem = [
      {
        id: idProduct,
        qty: inputValue
      }
    ];

    console.log('Đang thêm vào giỏ hàng:', listItem);

    const result = await fetchAddProductToCart(accessToken, listItem);

    if (!result) {
      alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!');
      return;
    }

    try {
      const response = await fetchGetCart(accessToken);
      const data = await response.json();

      if (data) {
        dispatch(setCartStore(data.cart));
        dispatch(setCartItems(data.cartItems));
      }
    } catch (error) {
      console.error('Error fetching updated cart:', error);
    }
  };

  const onChangeHandler = (event) => {
    const value = parseInt(event.target.value, 10);
    setInputValue(value >= 1 ? value : 1);
  };

  const handlePlusProduct = () => {
    let quantity = parseInt(inputRef.current.value, 10) + 1;
    setInputValue(quantity);
  };

  const handleMinusProduct = () => {
    let quantity = parseInt(inputRef.current.value, 10) - 1;
    if (quantity < 1) quantity = 1;
    setInputValue(quantity);
  };

  const getProductImage = () => {
    if (!productItem || !productItem.image) return pizza;

    return productItem.image.startsWith('http')
      ? productItem.image
      : `http://localhost:8080/static/images/${productItem.image}`;
  };

  return (
    <>
      <Cart accessToken={accessToken} />

      <div className='product-details container'>
        <div className='product-details__head'>
          <div className='product-details__images'>
            <div className='product-details__images-main'>
              <img
                src={getProductImage()}
                alt={productItem ? productItem.name : 'Sản phẩm'}
                onError={(e) => e.target.src = pizza}
              />
            </div>
          </div>

          <div className='product-details__options'>
            <div className='product-details__options__name'>
              {productItem && productItem.name}
            </div>
            <div className='product-details__options__price'>
              {productItem && productItem.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
            </div>

            <hr />

            <div className='product-details__options__group'>
              <div className='product-details__options__group-quantity'>
                <button className='minus' type='button' onClick={handleMinusProduct}>-</button>
                <input
                  ref={inputRef}
                  id='quantity'
                  type='number'
                  value={inputValue}
                  name='quantity'
                  onChange={onChangeHandler}
                  min={1}
                />
                <button className='add' type='button' onClick={handlePlusProduct}>+</button>
              </div>

              <button
                className='product-details__submit'
                type='button'
                onClick={() => addProductInCart(productItem._id)}
              >
                Add To Cart
              </button>
            </div>

            <hr />
          </div>
        </div>

        <div className='product-details__desc'>
          <div className='product-details__desc__title'>Mô tả sản phẩm</div>
          <div className='product-details__desc__text'>
            <p>{productItem && productItem.detail}</p>
          </div>
        </div>

        <div className='product-details__related'>
          <div className='product-details__related__title'>Sản phẩm liên quan</div>
          <div className='product-details__related__list'>
            <Swiper
              spaceBetween={30}
              slidesPerView={Math.min(productRelated.length, 4)}
              loop={true}
              speed={1000}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, Navigation]}
            >
              {productRelated.map((product, index) => (
                <SwiperSlide key={index}>
                  <ProductCard items={product} fullCol={false} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}

export default Detail;
