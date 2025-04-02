module.exports = app => {
  const cart = require("../controllers/cart.controller.js");

  var router = require("express").Router();

  // init cart
  router.post("/", cart.initOrRetrieveCart); // POST /api/cart

  // add product to cart
  router.post("/add", cart.addProductToCart); // POST /api/cart/add

  // update cart
  router.post("/update", cart.updateCartItem); // POST /api/cart/update

  // get cart
  router.get("/", cart.getCart); // GET /api/cart

  // delete item in cart
  router.delete("/:id", cart.deleteCartItem); // DELETE /api/cart/:id

  app.use("/api/cart", router);
};
