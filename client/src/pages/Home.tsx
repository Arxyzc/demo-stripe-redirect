import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { user } = useUser();
  const [amount, setAmount] = useState("29.99");
  const [description, setDescription] = useState("Premium Demo Product");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error creating checkout session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-8 h-8 text-blue-600" />
                Stripe Payment Demo
              </h1>
              <p className="text-slate-600 mt-1">Test the Stripe Checkout flow</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Logged in as</p>
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-1">
            <Card className="h-full border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-slate-900">Product Details</CardTitle>
                <CardDescription>Premium Demo Package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                  <div className="text-4xl font-bold text-blue-600 mb-2">${amount}</div>
                  <p className="text-slate-600 text-sm">{description}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Instant access to premium features</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Secure payment processing with Stripe</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">24/7 customer support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-slate-900">Checkout</CardTitle>
                <CardDescription>
                  Test the Stripe Checkout redirect flow. Use test card: 4242 4242 4242 4242
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-900 font-semibold">
                      Amount (USD)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-slate-500">Minimum: $0.50</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-900 font-semibold">
                      Product Description
                    </Label>
                    <Input
                      id="description"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter product name"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">
                      <span className="font-semibold">User ID:</span> {user.id}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Test Card Information</p>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><span className="font-mono">4242 4242 4242 4242</span> - Any future date, any CVC</p>
                      <p className="text-xs text-blue-700 mt-2">This is a test card provided by Stripe for development</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !amount || !description}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Proceed to Stripe Checkout
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    You will be redirected to Stripe Checkout for secure payment processing
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
