import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle, Copy, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Success Page - Payment Confirmation
 * Design Philosophy: Celebratory, clear confirmation with order details
 * - Colors: Green for success, clean white background
 * - Typography: Large success message, readable details
 * - Layout: Centered card with confirmation info
 * - Interactions: Copy to clipboard, navigation back
 */
export default function Success() {
  const [location] = useLocation();
  const [sessionData, setSessionData] = useState<{
    status: string;
    paymentIntentId: string;
    customerEmail: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const userId = params.get("user_id");

    if (sessionId) {
      verifySession(sessionId);
    }
  }, [location]);

  const verifySession = async (sessionId: string) => {
    try {
      const response = await fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify session");
      }

      const data = await response.json();
      setSessionData(data);
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to verify payment session");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id") || "";
  const userId = params.get("user_id") || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      {/* Success Card */}
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-green-900">Payment Successful!</CardTitle>
          <CardDescription className="text-green-700 mt-2">
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Info */}
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-slate-600">Verifying payment...</p>
            </div>
          ) : sessionData ? (
            <div className="space-y-4">
              {/* Payment Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">
                  <span className="font-semibold">Payment Status:</span>
                </p>
                <p className="text-lg font-bold text-green-700 capitalize">
                  {sessionData.status}
                </p>
              </div>

              {/* Session ID */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-semibold">Session ID:</span>
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-slate-700 break-all flex-1">
                    {sessionId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(sessionId)}
                    className="text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Payment Intent ID */}
              {sessionData.paymentIntentId && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-semibold">Payment Intent ID:</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-slate-700 break-all flex-1">
                      {sessionData.paymentIntentId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(sessionData.paymentIntentId)}
                      className="text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Customer Email */}
              {sessionData.customerEmail && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-semibold">Customer Email:</span>
                  </p>
                  <p className="text-slate-700">{sessionData.customerEmail}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-600">Could not verify payment details</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Next Steps:</span> Check your email for a confirmation receipt. Your access will be activated shortly.
            </p>
          </div>

          {/* Return Button */}
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-slate-600 max-w-md">
        <p>
          This is a demo of the Stripe Checkout flow. In production, you would handle order fulfillment and send confirmation emails here.
        </p>
      </div>
    </div>
  );
}
