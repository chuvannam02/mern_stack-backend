const router = require("express").Router();
const StripeController = require("../../controllers/stripeController");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY);
const Order = require("../../models/Order.model");
const Cart = require("../../models/Cart.model");
const createOrder = async (customer, data) => {
  // Retrieve cartId from customer metadata
  const cartId = customer.metadata.cartId;
  // console.log(data);
  // Query your MongoDB database to get the cart
  const cart = await Cart.findOne({ cartId: cartId });

  if (!cart) {
    console.log("Cart not found");
    return;
  }

  // Now you can use the cart to create the order
  const newOrder = new Order({
    cartId: cart.cartId,
    userId: cart.userId.toString(),
    orderId: Math.floor(Math.random() * 1000000), 
    shipping: data.shipping_details,
    payment: {
      name: data.customer_details.name,
      type: data.payment_method_types,
      status:data.payment_status
    },
    products: cart.products,
    delivery_status: 'Pending',
    total: data.amount_total,
    subTotal: data.amount_subtotal,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let eventType;
    const bodyObject = JSON.parse(req.body.toString("utf8"));
    let webhookSecret = process.env.STRIPE_WEB_HOOK;
    let data;

    if (webhookSecret) {
      let event;
      let signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = bodyObject.data.object;
      eventType = bodyObject.type;
    }

    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(bodyObject.data.object.customer)
        .then(async (customer) => {
          try {
            const userId = customer.metadata.userId;
            const cartId = customer.metadata.cartId;
              await createOrder(customer, data);
    
              // Delete the cart from the database
              await Cart.deleteOne({ userId: userId, cartId: cartId });
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);
module.exports = router;
