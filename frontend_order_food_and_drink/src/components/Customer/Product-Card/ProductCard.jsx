import React from 'react';
import { Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import pizza from '../../../assets/img/pizza.jpg'; // fallback image
import './productCard.scss';
import { setCartStore, setCartItems, setDisplayToast } from '../../../actions/user';
import { fetchAddProductToCart, fetchGetCart } from '../../../actions/cart';

function ProductCard({ items, fullCol }) {
  const { id, image, name, price } = items;
  console.log("Rendering ProductCard:", items);

  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isToast = useSelector(state => state.user.isToast);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Xử lý link ảnh
  let _image;
  if (image) {
    // Nếu là link đầy đủ thì dùng luôn, nếu không thì thêm prefix server backend
    if (image.startsWith('http://') || image.startsWith('https://')) {
      _image = image;
    } else {
      _image = `http://localhost:8080/static/images/${image}`;
    }
  } else {
    _image = pizza; // fallback nếu không có ảnh
  }

  const addProductInCart = async (idProduct) => {
    if (user && accessToken) {
      let itemProduct = [{ id: idProduct, qty: 1 }];
      await fetchAddProductToCart(accessToken, itemProduct);

      if (accessToken) {
        const getItemsCart = async () => {
          const response = await fetchGetCart(accessToken);
          const data = await response.json();

          if (data) {
            dispatch(setCartStore(data.cart));
            dispatch(setCartItems(data.cartItems));
            dispatch(setDisplayToast(!isToast));
          }
        };
        getItemsCart();
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Col xs={fullCol ? 3 : 100}>
        <div className='product-card'>
          <Link to={`/detail/${id}`} className="product-img">
            <img
              src={_image}
              alt={name}
              onError={(e) => e.target.src = pizza} // fallback ảnh khi lỗi
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Link>

          <div className="product-info">
            <div className="product-info-left">
              <span className='product-name'>
                {name}
              </span>
            </div>

            <div className="product-info-right">
              <span className='product-price'>
                {price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
              </span>

              <div className='btn btn-add-cart' onClick={() => addProductInCart(id)}>
                <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="22" height="20" rx="5" fill="#BEBEBE" />
                  <rect x="0.5" y="0.5" width="22" height="20" rx="5" fill="#F3BA00" />
                  <path d="M11.5991 10.6961V16.1863M6.04956 10.6961H11.5991H6.04956ZM17.1487 10.6961H11.5991H17.1487ZM11.5991 10.6961V5.20587V10.6961Z" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}

export default ProductCard;
