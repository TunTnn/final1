const middlewares = require("./auth.middlewares");
const db = require("../models");
const Product = db.product;
const Cart = db.cart;
const CartItem = db.cartItem;

// ✅ Hàm kiểm tra và chuẩn hóa dữ liệu listItem
const validateListItems = (listItem) => {
    if (!listItem || !Array.isArray(listItem)) {
        console.warn("❌ listItem is not a valid array:", listItem);
        return false;
    }

    for (const item of listItem) {
        const qtyNumber = Number(item.qty);

        if (!item.id || isNaN(qtyNumber) || qtyNumber <= 0) {
            console.warn(`❌ Invalid item data:`, item);
            return false;
        }

        // ✅ Gán lại qty chuẩn hóa thành number
        item.qty = qtyNumber;
    }

    return true;
};

exports.initOrRetrieveCart = async (req, res) => {
    try {
        const auth = await middlewares.checkAuth(req);
        if (!auth) return res.status(401).send({ message: "Authentication failed" });

        const customer_id = auth.id;

        let cart = await Cart.findOne({ customer_id, is_active: true });

        if (!cart) {
            const newCart = new Cart({
                customer_id,
                total_item: 0,
                total_price: 0,
                is_active: true,
            });
            cart = await newCart.save();

            console.log("✅ New cart created:", cart);
            return res.status(200).send({ message: "New cart created", cart });
        }

        console.log("✅ Cart retrieved successfully:", cart);
        return res.status(200).send({ message: "Cart retrieved successfully", cart });
    } catch (error) {
        console.error("❌ initOrRetrieveCart error:", error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const auth = await middlewares.checkAuth(req);
        if (!auth) return res.status(401).send({ message: "Authentication failed" });

        const customer_id = auth.id;
        const cart = await Cart.findOne({ customer_id, is_active: true });

        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const listItem = req.body.listItem;

        console.log("📦 Incoming listItem for add:", listItem);

        if (!validateListItems(listItem)) {
            return res.status(400).send({ message: "Invalid product list provided" });
        }

        await Promise.all(
            listItem.map(async (item) => {
                const { id, qty } = item;
                console.log(`➡️ Adding product ${id} with qty ${qty}`);

                const product = await Product.findById(id);

                if (!product) {
                    console.warn(`❌ Product not found: ${id}`);
                    return;
                }

                const price = product.price;
                let cartItem = await CartItem.findOne({ cart_id: cart._id, product_id: id });

                if (cartItem) {
                    cartItem.qty += qty;
                    cartItem.total_price = price * cartItem.qty;
                    await cartItem.save();
                    console.log(`✅ Updated cart item: ${cartItem._id}`);
                } else {
                    const total_price = price * qty;
                    const newCartItem = new CartItem({
                        cart_id: cart._id,
                        product_id: id,
                        product_name: product.name,
                        product_image: product.image,
                        qty,
                        price,
                        total_price,
                    });
                    await newCartItem.save();
                    console.log(`✅ Added new cart item: ${newCartItem._id}`);
                }
            })
        );

        const cartItems = await CartItem.find({ cart_id: cart._id });

        cart.total_item = cartItems.length;
        cart.total_price = cartItems.reduce((acc, curr) => acc + curr.total_price, 0);
        await cart.save();

        res.status(200).send({
            message: "Product(s) added to cart successfully",
            cart,
            cartItems,
        });
    } catch (error) {
        console.error("❌ addProductToCart error:", error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const auth = await middlewares.checkAuth(req);
        if (!auth) return res.status(401).send({ message: "Authentication failed" });

        const customer_id = auth.id;
        const cart = await Cart.findOne({ customer_id, is_active: true });

        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const listItem = req.body.listItem;

        console.log("📦 Incoming listItem for update:", listItem);

        if (!validateListItems(listItem)) {
            return res.status(400).send({ message: "Invalid product list provided" });
        }

        await Promise.all(
            listItem.map(async (item) => {
                const { id, qty } = item;

                const product = await Product.findById(id);

                if (!product) {
                    console.warn(`❌ Product not found: ${id}`);
                    return;
                }

                const price = product.price;
                let cartItem = await CartItem.findOne({ cart_id: cart._id, product_id: id });

                if (cartItem) {
                    cartItem.qty = qty;
                    cartItem.total_price = price * qty;
                    await cartItem.save();
                    console.log(`✅ Updated cart item: ${cartItem._id}`);
                } else {
                    const total_price = price * qty;
                    const newCartItem = new CartItem({
                        cart_id: cart._id,
                        product_id: id,
                        product_name: product.name,
                        product_image: product.image,
                        qty,
                        price,
                        total_price,
                    });
                    await newCartItem.save();
                    console.log(`✅ Added new cart item: ${newCartItem._id}`);
                }
            })
        );

        const cartItems = await CartItem.find({ cart_id: cart._id });

        cart.total_item = cartItems.length;
        cart.total_price = cartItems.reduce((acc, curr) => acc + curr.total_price, 0);
        await cart.save();

        res.status(200).send({
            message: "Cart updated successfully",
            cart,
            cartItems,
        });
    } catch (error) {
        console.error("❌ updateCartItem error:", error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.getCart = async (req, res) => {
    try {
        const auth = await middlewares.checkAuth(req);
        if (!auth) return res.status(401).json({ message: "Authentication failed" });

        const customer_id = auth.id;
        const cart = await Cart.findOne({ customer_id, is_active: true });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cartItems = await CartItem.find({ cart_id: cart._id });

        res.status(200).json({
            message: "Cart retrieved successfully",
            cart,
            cartItems,
        });
    } catch (error) {
        console.error("❌ getCart error:", error);
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const auth = await middlewares.checkAuth(req);
        if (!auth) return res.status(401).json({ message: "Authentication failed" });

        const customer_id = auth.id;
        const cart = await Cart.findOne({ customer_id, is_active: true });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cartItemId = req.params.id;

        const cartItem = await CartItem.findOneAndDelete({
            _id: cartItemId,
            cart_id: cart._id,
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        const cartItems = await CartItem.find({ cart_id: cart._id });

        cart.total_item = cartItems.length;
        cart.total_price = cartItems.reduce((acc, curr) => acc + curr.total_price, 0);
        await cart.save();

        res.status(200).json({
            message: "Cart item deleted successfully",
            cart,
            cartItems,
        });
    } catch (error) {
        console.error("❌ deleteCartItem error:", error);
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
};
