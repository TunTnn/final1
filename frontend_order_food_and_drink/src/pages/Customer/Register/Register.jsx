import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useNavigate  } from "react-router-dom";
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

import './register.scss';

function Register(props) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone: '',
        gender: ''
    });
    const [showPassword, setShowPassword] = useState([]);
    const navigate = useNavigate();

    function handleChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();

        if(formData.password.length >= 6 && formData.confirm_password.length >= 6){
            const response = await fetch('/api/auth/register', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/login');
            }else{
                toast.error('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin');
            }
        } else {
            toast.error('Mật khẩu phải ít nhất là 6 ký tự');
        }
    }

    const handleTogglePassword = (index) =>{
        setShowPassword((prevPasswords) => {
            const updatedPasswords = [...prevPasswords];
            updatedPasswords[index] = !updatedPasswords[index];
            return updatedPasswords;
        });
    }

    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
            />
            <Container className='block-register'>
                <h2>Đăng ký</h2>
                <span>Đăng ký và nhảy vào cuộc hành trình thực phẩm!</span>

                <form className='register-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <div className='register-form-input'>
                            <input type="text" name='first_name' value={formData.first_name} onChange={handleChange} placeholder='Nhập tên của bạn' required/>
                        </div>

                        <div className='register-form-input'>
                            <input type="text" name='last_name' value={formData.last_name} onChange={handleChange} placeholder='Nhập họ của bạn' required/>
                        </div>
                    </div>

                    <div className='register-form-input'>
                        <input type="text" name='email' value={formData.email} onChange={handleChange} placeholder='Nhập email của bạn' required/>
                    </div>

                    <div className='register-form-input'>
                        <input type={ showPassword[0] ? 'text' : 'password' } name='password' value={formData.password} onChange={handleChange} placeholder='Nhập mật khẩu của bạn' required/>
                        { showPassword[0] ? <FaEyeSlash onClick={()=>handleTogglePassword(0)} /> : <FaEye onClick={()=>handleTogglePassword(0)} /> }
                    </div>

                    <div className='register-form-input'>
                        <input type={ showPassword[1] ? 'text' : 'password' } name='confirm_password' value={formData.confirm_password} onChange={handleChange} placeholder='Nhập mật khẩu của bạn' required/>
                        { showPassword[1] ? <FaEyeSlash onClick={()=>handleTogglePassword(1)} /> : <FaEye onClick={()=>handleTogglePassword(1)} /> }               
                    </div>

                    <div className='form-group'>
                        <div className='register-form-input'>
                            <input type="text" name='phone' value={formData.phone} onChange={handleChange} placeholder='Nhập số điện thoại'/>
                        </div>

                        <select name="gender" id="gender" value={formData.gender} onChange={handleChange}>
                            <option>Giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                    </div>

                    <div className='register-form-btn'>
                        <input type="submit" className='btn btn-register' value="Đăng ký"/>
                    </div>
                </form>
            </Container>
        </>
    );
}

export default Register;