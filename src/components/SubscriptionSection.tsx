import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Award, Crown, Sparkles } from "lucide-react";

interface SubscriptionSectionProps {
  onAuthClick: (mode: 'login' | 'signup') => void;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const SubscriptionSection = ({ onAuthClick }: SubscriptionSectionProps) => {
  const plans = [
    {
      name: "Basic Ordination",
      price: "FREE",
      period: "",
      description: "Perfect for officiating friends & family",
      icon: <Award className="h-6 w-6" />,
      features: [
        "Digital Minister Certificate",
        "Basic Legal Documentation",
        "Valid in All 50 States",
        "Instant Download",
        "Email Support",
        "1 Ceremony Script"
      ],
      popular: false,
      buttonText: "Get Ordained Free",
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "Premium Minister",
      price: "$29.99",
      period: "one-time",
      description: "Most popular for professional officiants",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Everything in Basic",
        "Premium Certificate Designs",
        "Wallet-Size Minister ID Card",
        "Letter of Good Standing",
        "Wedding Planning Guide",
        "50+ Ceremony Scripts",
        "Marriage Packet Templates",
        "Priority Support"
      ],
      popular: true,
      buttonText: "Upgrade to Premium",
      color: "from-amber-600 to-purple-600"
    },
    {
      name: "Professional Ministry",
      price: "$49.99",
      period: "one-time",
      description: "Complete ministry business package",
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        "Everything in Premium",
        "Ministry Credential Package",
        "State Filing Assistance",
        "Tax-Exempt Status Guide",
        "200+ Ceremony Scripts",
        "Custom Ceremony Builder",
        "Business Setup Resources",
        "24/7 Phone Support",
        "Legal Consultation Access"
      ],
      popular: false,
      buttonText: "Start Your Ministry",
      color: "from-purple-600 to-indigo-700"
    }
  ];

  const handleSubscribe = async (planName: string) => {
    if (planName === "Basic Ordination") {
      onAuthClick('signup');
      return;
    }
    // For paid plans, attempt Stripe checkout
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        onAuthClick('signup');
        return;
      }
      const res = await fetch(`${API_URL}/api/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          price_id: planName === "Premium Minister" ? "price_premium_minister" : "price_professional_ministry",
          success_url: window.location.origin + '/dashboard?payment=success',
          cancel_url: window.location.origin + '/pricing?payment=cancelled'
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      onAuthClick('signup');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200">
          Ordination Packages
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Choose Your Ordination Package
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get started for free or upgrade for professional features and enhanced credibility.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative border-2 transition-all duration-200 hover:shadow-lg ${
            plan.popular ? 'border-amber-500 shadow-xl scale-105' : 'border-gray-200 hover:border-amber-300'
          }`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-purple-600 text-white px-4 py-1">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pt-8">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 bg-gradient-to-r ${plan.color} text-white`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500 ml-1">/{plan.period}</span>}
              </div>
              <CardDescription className="mt-2 text-gray-600">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <ul className="space-y-3">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5 mr-3" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="px-6 pb-8">
              <Button className={`w-full h-11 bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`}
                onClick={() => handleSubscribe(plan.name)}>
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-2">All plans include lifetime access. No recurring fees. 30-day money-back guarantee.</p>
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <span className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-1" /> Secure Stripe Payments</span>
          <span className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-1" /> Instant Delivery</span>
          <span className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-1" /> Lifetime Updates</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;
