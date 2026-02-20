import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Award, HeartHandshake, Globe, Shield, BookOpen, Scale, ArrowRight } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import SubscriptionSection from "@/components/SubscriptionSection";
import { useMarriageLaws, useMarriageLaw } from "@/hooks/useMarriageLaws";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  const { laws, loading: lawsLoading } = useMarriageLaws();
  const { law: selectedLaw, loading: lawLoading } = useMarriageLaw(selectedState);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const features = [
    { icon: <Award className="h-6 w-6 text-amber-600" />, title: "Instant Ordination", description: "Become a legally ordained minister in under 5 minutes. Valid in all 50 states." },
    { icon: <HeartHandshake className="h-6 w-6 text-pink-600" />, title: "LGBTQ+ Affirming", description: "We celebrate love in all its forms. Every couple deserves a beautiful ceremony." },
    { icon: <Globe className="h-6 w-6 text-blue-600" />, title: "Interfaith Welcome", description: "All spiritual paths honored. Christian, Jewish, Muslim, Buddhist, Pagan, Secular, and more." },
    { icon: <Shield className="h-6 w-6 text-green-600" />, title: "Survivor Support", description: "Dedicated resources for survivors of religious trauma. Healing through inclusive spirituality." },
    { icon: <BookOpen className="h-6 w-6 text-purple-600" />, title: "AI Ceremony Builder", description: "Generate custom ceremonies with AI. Interfaith, LGBTQ+, traditional, and more." },
    { icon: <Scale className="h-6 w-6 text-indigo-600" />, title: "50-State Law Database", description: "Complete marriage law database for all 50 states. Know the requirements before you officiate." },
  ];

  const ceremonies = ["Weddings", "Vow Renewals", "Commitment Ceremonies", "Baby Blessings", "House Blessings", "Funerals", "Memorial Services", "Coming of Age"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-pink-50">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-purple-600 text-white border-0 px-4 py-1">
            ✨ 150,000+ Ministers Ordained • All 50 States
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Become an Ordained Minister<br />
            <span className="bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent">
              Celebrate Love, All Love
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Free online ordination in 5 minutes. Legally officiate weddings in all 50 states. LGBTQ+ affirming, interfaith welcome, trauma-informed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handleAuthClick('signup')} className="bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-700 hover:to-purple-700 px-8 py-4 text-lg">
              Get Ordained Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-amber-300 hover:border-amber-500 px-8 py-4 text-lg">
              <BookOpen className="mr-2 h-5 w-5" /> AI Ceremony Builder
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-1" /> Free Basic Ordination</span>
            <span className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-1" /> Valid in All 50 States</span>
            <span className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-1" /> Instant Certificate</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-amber-600 to-purple-700 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div><p className="text-3xl md:text-4xl font-bold">150,000+</p><p className="text-amber-100">Ministers Ordained</p></div>
          <div><p className="text-3xl md:text-4xl font-bold">500,000+</p><p className="text-amber-100">Ceremonies Performed</p></div>
          <div><p className="text-3xl md:text-4xl font-bold">50</p><p className="text-amber-100">States Recognized</p></div>
          <div><p className="text-3xl md:text-4xl font-bold">4.9/5</p><p className="text-amber-100">Average Rating</p></div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Ordain.church?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern, inclusive alternative to traditional ordination. Everyone deserves spiritual community.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ceremony Types */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ceremonies You Can Perform</h2>
            <p className="text-xl text-gray-600">As an ordained minister, you can officiate any of these ceremonies.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ceremonies.map((ceremony, i) => (
              <div key={i} className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-purple-50 rounded-lg">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{ceremony}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marriage Law Database */}
      <section id="marriage-laws" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <Scale className="inline h-8 w-8 mr-2 text-indigo-600" />
              State-by-State Marriage Law Database
            </h2>
            <p className="text-xl text-gray-600">Know the requirements before you officiate. Select a state below.</p>
          </div>
          
          {lawsLoading ? (
            <div className="text-center py-8"><p className="text-gray-600">Loading marriage laws...</p></div>
          ) : (
            <>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-13 gap-2 mb-8 justify-center">
                {laws.map((law) => (
                  <button key={law.state_code} onClick={() => setSelectedState(law.state_code)}
                    className={`px-2 py-1 text-xs font-medium rounded border transition-all ${
                      selectedState === law.state_code
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}>
                    {law.state_code}
                  </button>
                ))}
              </div>
              
              {selectedLaw && (
                <Card className="max-w-2xl mx-auto border-indigo-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-indigo-700">{selectedLaw.state_name} Marriage Laws</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Required:</span>
                      <Badge variant={selectedLaw.registration_required ? "destructive" : "secondary"}>
                        {selectedLaw.registration_required ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Waiting Period:</span>
                      <span className="font-medium">{selectedLaw.waiting_period_days === 0 ? "None" : `${selectedLaw.waiting_period_days} days`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Witnesses Required:</span>
                      <span className="font-medium">{selectedLaw.witnesses_required === 0 ? "None" : selectedLaw.witnesses_required}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Same-Sex Marriage:</span>
                      <Badge className="bg-green-100 text-green-700">Legal</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Validity:</span>
                      <span className="font-medium">{selectedLaw.license_validity_days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Age:</span>
                      <span className="font-medium">{selectedLaw.minimum_age} years</span>
                    </div>
                    {selectedLaw.notes && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-600">{selectedLaw.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </section>

      {/* Subscription */}
      <SubscriptionSection />

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Ministry?</h2>
          <p className="text-xl mb-8 text-amber-100">Join 150,000+ ordained ministers celebrating love and spirituality.</p>
          <Button size="lg" onClick={() => handleAuthClick('signup')} className="bg-white text-purple-700 hover:bg-amber-50 px-8 py-4 text-lg">
            Get Ordained Free Today <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onSwitchMode={setAuthMode} />
    </div>
  );
};

export default Index;
