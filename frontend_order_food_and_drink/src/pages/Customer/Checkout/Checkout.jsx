import React, {useEffect, useState} from 'react';
import { Container, Form, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import Cart from '../../../components/Customer/Cart/Cart';
import PopupOrderSuccess from '../../../components/Customer/PopupOrderSuccess/PopupOrderSuccess';
import pizza from '../../../assets/img/pizza.jpg';
import { fetchGetCart } from '../../../actions/cart';
import {setCartItems, setCartStore} from '../../../actions/user';
import { fetchOrder, fetchPayment } from '../../../actions/order';
import './checkout.scss';
import { fetchUpdateIsPayment } from '../../../actions/order';

function Checkout(props) {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showPoppup, setShowPopup] = useState(false);
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
    const cart = useSelector(state => state.user.cart);
    const cartItems = useSelector(state => state.user.cartItems);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(accessToken){
            const getItemsCart = async ()=>{
                const response = await fetchGetCart(accessToken);
                const data = await response.json();
    
                if(data){
                    const cartAction = setCartStore(data.cart);
                    const cartItemsAction = setCartItems(data.cartItems);
                    dispatch(cartAction);
                    dispatch(cartItemsAction);
                }
            }
            getItemsCart();
        }
    }, []);

    const handleSelectPayment = (event)=>{
        const paymentMethodValue = event.target.value;
        setPaymentMethod(paymentMethodValue);
    }

    const handleOrder = async (event)=>{
        event.preventdefault;
        const cartId = cart.id;
        
        if(paymentMethod === '' || cartId === null){
            toast.error('Vui lòng chọn phương thức thanh toán');
            return;
        }
    
        if(paymentMethod === 'cash'){
            const data = await fetchOrder(cartId);

            if(data.success) return setShowPopup(true);
        }else{
            const data = await fetchPayment(cartId);

            if(data && data.paymentUrl !== ''){
                window.location.href = `${data.paymentUrl}`;
            }
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        
        const myParam = urlParams.get('vnp_TransactionStatus');
        const orderInfo = urlParams.get('vnp_OrderInfo');
        var arrOId = '';
        if (orderInfo) {
            arrOId = orderInfo.split(':');
        }

        if(myParam === '00'){ 
            fetchUpdateIsPayment(arrOId[1], true);
            return setShowPopup(true);
        }
    }, []);

    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
            /> 

            <Cart accessToken={accessToken}/>
            <PopupOrderSuccess 
                show={showPoppup}
                backdrop="static"
            />
            <Container className='block-checkout'>
                <div className="checkout-title">
                    <h2>Thanh toán</h2>
                </div>
                <div className="checkout-content">
                    <Table>
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Số tiền</th>
                                <th>Đơn giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartItems.map((item, index)=>{
                                    const {id, cart_id, product_id, product_name, product_image ,price, qty, total_price} = item;
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <img src={`http://localhost:8080/static/images/${product_image}`} alt="" />

                                                <span className='product-name'>{product_name}</span>
                                            </td>
                                            <td>
                                                <span className='product-quantity'>{qty}</span>
                                            </td>
                                            <td>
                                                <span className='product-price'>{price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                            </td>
                                            <td>
                                                <span className='product-price'>{total_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>

                    <div className="checkout-group">
                        <div className="checkout-payment">
                            <label>Chọn phương thức thanh toán</label>
                            <Form.Select name="payment" onChange={handleSelectPayment}>
                                <option value="">Phương thức thanh toán</option>
                                <option value="cash">Trả bằng tiền mặt</option>
                                <option value="transfer">Chuyển khoản ngân hàng</option>
                            </Form.Select>
                        </div>

                        <div className="checkout-box">
                            <div className="box-group">
                                <label>Tổng tiền hàng</label>
                                <span>{cart && cart.total_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                            </div>
                            {/* <div className="box-group">
                                <label>Phí ship</label>
                                <span>2.000 đ</span>
                            </div> */}
                            <hr />
                            <div className="box-group">
                                <label className='title-order'>Số tiền thanh toán</label>
                                <span className='price-order'>{cart && cart.total_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                            </div>

                            <button onClick={handleOrder} className='btn-checkout'>Đặt hàng</button>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Checkout;