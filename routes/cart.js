// Cart Routes

const express = require('express');
const routerUnprotected = express.Router();
const routerProtected = express.Router();
const { getOrCreateCart, addProductToCart, removeProductFromCart } = require('../controllers/cartControllers');

const auth = require('../middleware/auth');
const mockAuth = require('../middleware/mockAuth');
const role = require('../middleware/role');

routerProtected.use(auth);
routerProtected.use(role(['user', 'admin']));

routerUnprotected.use(mockAuth);
routerUnprotected.use(role(['user', 'admin']));

for (let route of [routerProtected, routerUnprotected]) {
  // router.get('/', getCarts);
  route.get('/', getOrCreateCart); 
  route.post('/', getOrCreateCart);
  route.put('/:id', addProductToCart);
  route.delete('/:id', removeProductFromCart);
}

module.exports = { cartRouterProtected: routerProtected, cartRouterUnprotected: routerUnprotected };