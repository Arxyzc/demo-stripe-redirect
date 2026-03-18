import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-red-900">Payment Cancelled</CardTitle>
          <CardDescription className="text-red-700 mt-2">
            Your payment was cancelled and no charge was made
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-900">
              You have been returned from the Stripe Checkout page. If this was intentional, no worries! You can try again anytime.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">What happened?</span> You cancelled the payment process before completing it on the Stripe Checkout page.
            </p>
          </div>

          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-slate-600 max-w-md">
        <p>
          This is a demo of the Stripe Checkout flow. You can return to the home page and try again with the test card.
        </p>
      </div>
    </div>
  );
}
