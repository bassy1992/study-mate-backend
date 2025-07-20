import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CreditCard,
  Smartphone,
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [mobileMoneyData, setMobileMoneyData] = useState({
    network: "",
    phoneNumber: "",
  });
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const orderSummary = {
    bundle: "JHS 2 Bundle",
    amount: 15.0,
    currency: "USD",
  };

  const mobileMoneyNetworks = [
    { id: "mtn", name: "MTN Mobile Money", logo: "📱" },
    { id: "vodafone", name: "Vodafone Cash", logo: "📱" },
    { id: "airteltigo", name: "AirtelTigo Money", logo: "📱" },
  ];

  const handleMobileMoneyChange = (field: string, value: string) => {
    setMobileMoneyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment
    console.log("Payment method:", selectedMethod);
    console.log(
      "Payment data:",
      selectedMethod === "mobile-money" ? mobileMoneyData : cardData,
    );
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link to="/bundles" className="hover:text-gold">
              Course Bundles
            </Link>
            <span>/</span>
            <Link to="/checkout" className="hover:text-gold">
              Checkout
            </Link>
            <span>/</span>
            <span className="text-gray-900">Payment</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="space-y-8">
                  {/* Header */}
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Choose Payment Method
                    </h1>
                    <p className="text-gray-600">
                      Select your preferred payment method to complete your
                      purchase
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Payment Options
                      </h2>

                      <RadioGroup
                        value={selectedMethod}
                        onValueChange={setSelectedMethod}
                        className="space-y-4"
                      >
                        {/* Mobile Money Option */}
                        <div className="border-2 rounded-xl p-4 hover:border-gold transition-colors">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem
                              value="mobile-money"
                              id="mobile-money"
                            />
                            <Label
                              htmlFor="mobile-money"
                              className="flex items-center space-x-3 cursor-pointer flex-1"
                            >
                              <div className="bg-gold/10 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Smartphone className="h-5 w-5 text-gold" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  Mobile Money
                                </div>
                                <div className="text-sm text-gray-600">
                                  MTN, Vodafone, AirtelTigo
                                </div>
                              </div>
                            </Label>
                            <div className="text-sm font-medium text-emerald">
                              Recommended
                            </div>
                          </div>
                        </div>

                        {/* Credit/Debit Card Option */}
                        <div className="border-2 rounded-xl p-4 hover:border-gold transition-colors">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="card" id="card" />
                            <Label
                              htmlFor="card"
                              className="flex items-center space-x-3 cursor-pointer flex-1"
                            >
                              <div className="bg-emerald/10 w-10 h-10 rounded-lg flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-emerald" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  Credit/Debit Card
                                </div>
                                <div className="text-sm text-gray-600">
                                  Visa, Mastercard
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Mobile Money Details */}
                    {selectedMethod === "mobile-money" && (
                      <div className="space-y-6 border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Mobile Money Details
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Select Network</Label>
                            <RadioGroup
                              value={mobileMoneyData.network}
                              onValueChange={(value) =>
                                handleMobileMoneyChange("network", value)
                              }
                              className="grid grid-cols-1 gap-3"
                            >
                              {mobileMoneyNetworks.map((network) => (
                                <div
                                  key={network.id}
                                  className="border rounded-lg p-3 hover:bg-gray-50"
                                >
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem
                                      value={network.id}
                                      id={network.id}
                                    />
                                    <Label
                                      htmlFor={network.id}
                                      className="flex items-center space-x-3 cursor-pointer flex-1"
                                    >
                                      <span className="text-2xl">
                                        {network.logo}
                                      </span>
                                      <span className="font-medium">
                                        {network.name}
                                      </span>
                                    </Label>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="momo-phone">Mobile Number</Label>
                            <Input
                              id="momo-phone"
                              type="tel"
                              placeholder="+233 XX XXX XXXX"
                              value={mobileMoneyData.phoneNumber}
                              onChange={(e) =>
                                handleMobileMoneyChange(
                                  "phoneNumber",
                                  e.target.value,
                                )
                              }
                              className="h-12"
                            />
                            <p className="text-xs text-gray-500">
                              Enter the mobile number associated with your
                              Mobile Money account
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Details */}
                    {selectedMethod === "card" && (
                      <div className="space-y-6 border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Card Details
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardholder">Cardholder Name</Label>
                            <Input
                              id="cardholder"
                              name="cardholderName"
                              type="text"
                              placeholder="Full name as on card"
                              value={cardData.cardholderName}
                              onChange={handleCardChange}
                              className="h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardnumber">Card Number</Label>
                            <Input
                              id="cardnumber"
                              name="cardNumber"
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={formatCardNumber(cardData.cardNumber)}
                              onChange={(e) =>
                                setCardData((prev) => ({
                                  ...prev,
                                  cardNumber: e.target.value,
                                }))
                              }
                              className="h-12"
                              maxLength={19}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                name="expiryDate"
                                type="text"
                                placeholder="MM/YY"
                                value={cardData.expiryDate}
                                onChange={handleCardChange}
                                className="h-12"
                                maxLength={5}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                name="cvv"
                                type="text"
                                placeholder="123"
                                value={cardData.cvv}
                                onChange={handleCardChange}
                                className="h-12"
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    {selectedMethod && (
                      <div className="flex items-center justify-between pt-6 border-t">
                        <Button variant="outline" asChild>
                          <Link to="/checkout">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Checkout
                          </Link>
                        </Button>
                        <Button
                          type="submit"
                          className="bg-emerald hover:bg-emerald/90 text-white"
                        >
                          Complete Payment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{orderSummary.bundle}</span>
                    <span className="font-medium">
                      ${orderSummary.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-gold">
                        ${orderSummary.amount.toFixed(2)}{" "}
                        {orderSummary.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Security */}
              <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-emerald" />
                  <h3 className="font-semibold text-gray-900">
                    Secure Payment
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span>No payment details stored</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Information
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Mobile Money:</span> You'll
                    receive an SMS prompt to authorize the payment on your
                    phone.
                  </div>
                  <div>
                    <span className="font-medium">Credit/Debit Card:</span>{" "}
                    Payments are processed securely through our payment gateway.
                  </div>
                  <div>
                    <span className="font-medium">Access:</span> You'll get
                    instant access to your course after successful payment.
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Need Help?
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Payment Issues:</span> Contact
                    us immediately if payment fails
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href="mailto:support@ghanalearn.com"
                      className="text-gold hover:underline"
                    >
                      support@ghanalearn.com
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> +233 XX XXX XXXX
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
