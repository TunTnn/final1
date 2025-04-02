import React, { useState } from 'react';
import contactImg from '../../../assets/img/contact.png';
import './contact.scss';

function Contact(props) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Xử lý khi nhập input/textarea
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý khi bấm GỬI
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn chặn reload trang!

        // Bạn có thể gọi API hoặc gửi dữ liệu ở đây
        console.log('Dữ liệu form:', formData);

        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.');

        // Reset form sau khi gửi thành công
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <div className='block-contact'>
            <div className="contact-form">
                <div className='contact-form-head'>
                    <h3>Bạn có câu hỏi hoặc hỏi về chúng tôi?</h3>
                    <span>Điền vào biểu mẫu này và chúng tôi sẽ liên hệ với bạn trong 48 giờ tới.</span>
                </div>

                {/* Form có handleSubmit để chặn reload */}
                <form onSubmit={handleSubmit}>
                    <div className='contact-form-group'>
                        <input
                            type="text"
                            placeholder='Tên của bạn'
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            placeholder='Email của bạn'
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder='Vui lòng nhập ý kiến của bạn'
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            cols="30"
                            rows="10"
                            required
                        ></textarea>
                    </div>

                    {/* Giữ nguyên thiết kế button GỬI */}
                    <div className='btn-contact'>
                        <input type="submit" value="Gửi" />
                    </div>
                </form>
            </div>

            <div className="contact-img">
                <img src={contactImg} alt="Contact" />
            </div>
        </div>
    );
}

export default Contact;