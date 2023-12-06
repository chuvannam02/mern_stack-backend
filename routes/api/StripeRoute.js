const router = require("express").Router();
const StripeController = require("../../controllers/stripeController");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY);
router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "VND",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        return res.status(500).json(stripeErr);
      } else {
        return res.status(200).json(stripeRes);
      }
    }
  );
});

router.post("/create-checkout-session", StripeController.createCheckoutSession);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   //Stripe Webhook
//   async (req, res) => {
//     let eventType;

//     // Check if webhook signing is configured.
//     let webhookSecret;
//     webhookSecret = process.env.STRIPE_WEB_HOOK;
//     console.log(req.body);
//     if (webhookSecret) {
//       // Retrieve the event by verifying the signature using the raw body and secret.
//       let event;
//       let signature = req.headers["stripe-signature"];
//       try {
//         event = stripe.webhooks.constructEvent(
//           req.body,
//           signature,
//           webhookSecret
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed:  ${err}`);
//         return res.sendStatus(400);
//       }
//       // Extract the object from the event.
//       data = event.data.object;
//       eventType = event.type;
//     } else {
//       // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//       // retrieve the event data directly from the request body.
//       data = req.body.data.object;
//       eventType = req.body.type;
//     }

//     // Handle the checkout.session.completed event
//     if (eventType === "checkout.session.completed") {
//       stripe.customers
//         .retrieve(data.object.customer)
//         .then(async (customer) => {
//           try {
//             // CREATE ORDER
//             createOrder(customer, data);
//           } catch (err) {
//             console.log(typeof createOrder);
//             console.log(err);
//           }
//         })
//         .catch((err) => console.log(err.message));
//     }

//     res.status(200).end();
//   }
// );
module.exports = router;
