const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY);
const Cart = require("../models/Cart.model");
const StripeController = {
  // test stripe
  //   createCheckoutSession: async (req, res) => {
  //     const customer = await stripe.customers.create({
  //       metadata: { user_id: req.user_id, ticket_amount: req.body.ticketAmount },
  //     }); // Create a new customer
  //     const session = await stripe.checkout.sessions.create({
  //       customer: customer.id,
  //       line_items: [
  //         {
  //           price_data: {
  //             currency: "usd",
  //             product_data: {
  //               name: "T-shirt",
  //             },
  //             unit_amount: 2000,
  //           },
  //           quantity: 1,
  //         },
  //       ],
  //       mode: "payment",
  //       success_url: process.env.STRIPE_SUCCESS_URL,
  //       cancel_url: process.env.STRIPE_CANCEL_URL,
  //     }); // Create a new session
  //     return res.status(200).json({ data: session });
  //   },

  createCheckoutSession: async (req, res) => {
    const body = JSON.parse(req.body.toString("utf8"));
    let newCart;
    let cartId;
    let existingCart;
    do {
      cartId = Math.floor(Math.random() * 1000000); // Replace with your own logic for generating cartId

      newCart = new Cart({
        userId: body.userId,
        cartId: cartId,
        products: body.cartItems,
      });

      // Check if a cart with this ID already exists
      existingCart = await Cart.findOne({ cartId: cartId });
    } while (existingCart);

    // Save the new cart to the database
    newCart.save(function (err) {
      if (err) return console.error(err);
      console.log("Cart saved.");
    });

    const customer = await stripe.customers.create({
      metadata: {
        userId: body.userId,
        // cart: JSON.stringify(body.cartItems),
        cartId: cartId,
      },
    });
    const line_items = body.cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.image],
            // description: item.desc,
            metadata: {
              id: item.id,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "VN"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      mode: "payment",
      customer: customer.id,
      // customer: customer.userId,
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // res.redirect(303, session.url);
    res.send({ url: session.url });
  },
};
module.exports = StripeController;
