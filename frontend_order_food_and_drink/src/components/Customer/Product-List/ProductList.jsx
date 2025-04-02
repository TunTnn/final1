import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row } from 'react-bootstrap';

import ProductCard from '../Product-Card/ProductCard';
import './productList.scss';

function ProductList({ products: propProducts }) {
    const [products, setProducts] = useState([]);
    const categoryId = useSelector(state => state.user.categoryId);

    const fetchProducts = async () => {
        let url = categoryId 
            ? `http://localhost:8080/api/product/category/${categoryId}`
            : `http://localhost:8080/api/product`;

        console.log("Fetching data from:", url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch products");
            
            const data = await response.json();
            console.log("API response:", data);
            
            setProducts(data.length > 0 ? data : []);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        }
    };

    // Nếu không truyền prop products, tự fetch theo categoryId
    useEffect(() => {
        if (!propProducts) {
            fetchProducts();
        } else {
            setProducts(propProducts);
        }
    }, [categoryId, propProducts]);

    return (
        <div className='product-list'>
            <Row>
                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        product.is_active && (
                            <ProductCard key={index} items={product} fullCol={true} />
                        )
                    ))
                ) : (
                    <p>Không có sản phẩm nào.</p>
                )}
            </Row>
        </div>
    );
}

export default ProductList;
