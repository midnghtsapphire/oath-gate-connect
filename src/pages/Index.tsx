
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Shield, Zap, Users, ArrowRight } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import SubscriptionSection from "@/components/SubscriptionSection";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Lightning Fast",
      description: "Built for speed and performance with modern technology stack"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team in real-time"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SaaSApp</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => handleAuthClick('login')}
                className="text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => handleAuthClick('signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
            ✨ New: Advanced Analytics Dashboard
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Amazing Products
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Faster Than Ever
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The all-in-one platform that helps teams create, collaborate, and scale their projects with 
            powerful tools and seamless integrations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => handleAuthClick('signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-gray-300 hover:border-blue-600 px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SaaSApp?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to build, launch, and scale your projects successfully.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscription Section */}
      <SubscriptionSection onAuthClick={handleAuthClick} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">SaaSApp</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 SaaSApp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
