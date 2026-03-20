import express from "express";
import { createServer } from "http";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("❌ ERROR: STRIPE_SECRET_KEY no está definida en las variables de entorno");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS headers
  app.use((req, res, next) => {
    const allowedOrigins = [
      "https://demo-pago.netlify.app",
      "http://localhost:5173",
    ];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get Stripe public key
  app.get("/api/stripe/public-key", (_req, res) => {
    res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
  });

  // Create checkout session
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { amount, description, userId } = req.body;

      if (!amount || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

      console.log("🔍 FRONTEND_URL:", frontendUrl);
      console.log("🔍 Cancel URL:", `${frontendUrl}/cancel`);
      console.log("🔍 Success URL:", `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: description,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`,
        cancel_url: `${frontendUrl}/cancel`,
        customer_email: `user-${userId}@demo.local`,
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Verify payment session
  app.post("/api/stripe/verify-session", async (req, res) => {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: "Missing session ID" });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      res.json({
        status: session.payment_status,
        paymentIntentId: session.payment_intent,
        customerEmail: session.customer_email,
      });
    } catch (error) {
      console.error("Error verifying session:", error);
      res.status(500).json({ error: "Failed to verify session" });
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`✅ FRONTEND_URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  });
}

startServer().catch(console.error);