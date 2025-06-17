
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Rocket, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SubscriptionSectionProps {
  onAuthClick: (mode: 'login' | 'signup') => void;
}

const SubscriptionSection = ({ onAuthClick }: SubscriptionSectionProps) => {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals and small projects",
      icon: <Rocket className="h-6 w-6" />,
      features: [
        "Up to 5 projects",
        "Basic analytics",
        "Email support",
        "1GB storage",
        "Standard templates"
      ],
      popular: false,
      buttonText: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Best for growing teams and businesses",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "50GB storage",
        "Premium templates",
        "Team collaboration",
        "API access"
      ],
      popular: true,
      buttonText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations with advanced needs",
      icon: <Building className="h-6 w-6" />,
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated support",
        "Unlimited storage",
        "Advanced security",
        "Custom branding",
        "SLA guarantee"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  const handleSubscribe = (planName: string) => {
    if (planName === "Enterprise") {
      toast({
        title: "Contact Sales",
        description: "Our team will get in touch with you shortly to discuss enterprise options.",
      });
    } else {
      toast({
        title: "Subscription Selected",
        description: `Please connect to Supabase and set up Stripe to enable ${planName} subscription.`,
      });
      onAuthClick('signup');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-green-50 text-green-700 border-green-200">
          💳 Flexible Pricing
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start with a free trial, then choose the plan that fits your needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative border-2 transition-all duration-200 hover:shadow-lg ${
              plan.popular 
                ? 'border-blue-500 shadow-lg scale-105' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pt-8">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                plan.popular 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
              <CardDescription className="mt-4 text-gray-600">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="px-6 pb-8">
              <Button 
                className={`w-full h-11 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
                onClick={() => handleSubscribe(plan.name)}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            Cancel anytime
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            Secure payments
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            24/7 support
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;
