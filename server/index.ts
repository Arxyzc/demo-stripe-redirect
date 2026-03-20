import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";

// Cargar variables de entorno desde .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener la clave secreta de Stripe desde variables de entorno
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("❌ ERROR: STRIPE_SECRET_KEY no está definida en las variables de entorno");
  console.error("Por favor, crea un archivo .env en la raíz del proyecto con:");
  console.error("  STRIPE_SECRET_KEY=sk_test_...");
  console.error("  STRIPE_PUBLIC_KEY=pk_test_...");
  process.exit(1);
}

// Initialize Stripe with the secret key
const stripe = new Stripe(stripeSecretKey);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS headers for development
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // API Routes

  // Get Stripe public key (safe to expose)
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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: description,
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`,
        cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/cancel`,
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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}/`);
    console.log(`✅ Stripe integration ready`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer().catch(console.error);
