import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Star, Shield, Heart, Users, ArrowRight, BookOpen, Globe, Scale, Church, Award, Sparkles, HeartHandshake, Phone, Mail, MapPin } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import SubscriptionSection from "@/components/SubscriptionSection";

const STATES_DATA = [
  { code: "AL", name: "Alabama", regRequired: true, waitDays: 0, witnesses: 2 },
  { code: "AK", name: "Alaska", regRequired: false, waitDays: 3, witnesses: 2 },
  { code: "AZ", name: "Arizona", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "AR", name: "Arkansas", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "CA", name: "California", regRequired: false, waitDays: 0, witnesses: 1 },
  { code: "CO", name: "Colorado", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "CT", name: "Connecticut", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "DE", name: "Delaware", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "FL", name: "Florida", regRequired: false, waitDays: 3, witnesses: 2 },
  { code: "GA", name: "Georgia", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "HI", name: "Hawaii", regRequired: false, waitDays: 0, witnesses: 1 },
  { code: "ID", name: "Idaho", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "IL", name: "Illinois", regRequired: false, waitDays: 1, witnesses: 1 },
  { code: "IN", name: "Indiana", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "IA", name: "Iowa", regRequired: false, waitDays: 3, witnesses: 2 },
  { code: "KS", name: "Kansas", regRequired: false, waitDays: 3, witnesses: 0 },
  { code: "KY", name: "Kentucky", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "LA", name: "Louisiana", regRequired: false, waitDays: 3, witnesses: 2 },
  { code: "ME", name: "Maine", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "MD", name: "Maryland", regRequired: false, waitDays: 2, witnesses: 0 },
  { code: "MA", name: "Massachusetts", regRequired: true, waitDays: 3, witnesses: 0 },
  { code: "MI", name: "Michigan", regRequired: false, waitDays: 3, witnesses: 2 },
  { code: "MN", name: "Minnesota", regRequired: false, waitDays: 5, witnesses: 2 },
  { code: "MS", name: "Mississippi", regRequired: false, waitDays: 3, witnesses: 0 },
  { code: "MO", name: "Missouri", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "MT", name: "Montana", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "NE", name: "Nebraska", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "NV", name: "Nevada", regRequired: false, waitDays: 0, witnesses: 1 },
  { code: "NH", name: "New Hampshire", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "NJ", name: "New Jersey", regRequired: false, waitDays: 3, witnesses: 0 },
  { code: "NM", name: "New Mexico", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "NY", name: "New York", regRequired: true, waitDays: 1, witnesses: 1 },
  { code: "NC", name: "North Carolina", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "ND", name: "North Dakota", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "OH", name: "Ohio", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "OK", name: "Oklahoma", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "OR", name: "Oregon", regRequired: false, waitDays: 3, witnesses: 2 },
  { code: "PA", name: "Pennsylvania", regRequired: false, waitDays: 3, witnesses: 2 },
  { code: "RI", name: "Rhode Island", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "SC", name: "South Carolina", regRequired: false, waitDays: 1, witnesses: 2 },
  { code: "SD", name: "South Dakota", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "TN", name: "Tennessee", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "TX", name: "Texas", regRequired: false, waitDays: 3, witnesses: 0 },
  { code: "UT", name: "Utah", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "VT", name: "Vermont", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "VA", name: "Virginia", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "WA", name: "Washington", regRequired: false, waitDays: 3, witnesses: 2 },
  { code: "WV", name: "West Virginia", regRequired: false, waitDays: 0, witnesses: 2 },
  { code: "WI", name: "Wisconsin", regRequired: false, waitDays: 5, witnesses: 2 },
  { code: "WY", name: "Wyoming", regRequired: false, waitDays: 0, witnesses: 0 },
  { code: "DC", name: "District of Columbia", regRequired: false, waitDays: 0, witnesses: 0 },
];

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: <Award className="h-6 w-6 text-amber-600" />,
      title: "Instant Ordination",
      description: "Become a legally ordained minister in under 5 minutes. Valid in all 50 states."
    },
    {
      icon: <HeartHandshake className="h-6 w-6 text-pink-600" />,
      title: "LGBTQ+ Affirming",
      description: "We celebrate love in all its forms. Every couple deserves a beautiful ceremony."
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      title: "Interfaith Welcome",
      description: "All spiritual paths honored. Christian, Jewish, Muslim, Buddhist, Pagan, Secular, and more."
    },
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Survivor Support",
      description: "Dedicated resources for survivors of religious trauma. Healing through inclusive spirituality."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      title: "Ceremony Library",
      description: "200+ ceremony scripts for weddings, funerals, baby blessings, house blessings, and more."
    },
    {
      icon: <Scale className="h-6 w-6 text-indigo-600" />,
      title: "State Law Database",
      description: "Complete marriage law guide for all 50 states. Know your rights and requirements."
    },
  ];

  const ceremonies = [
    "Wedding Ceremonies", "Vow Renewals", "Commitment Ceremonies", "Handfasting",
    "Baby Blessings", "Naming Ceremonies", "House Blessings", "Memorial Services",
    "Funeral Services", "Pet Blessings", "Interfaith Ceremonies", "Same-Sex Weddings",
    "Elopement Ceremonies", "Military Weddings", "Destination Weddings", "Secular Ceremonies"
  ];

  const testimonials = [
    {
      name: "Sarah & Michelle",
      text: "After being turned away by three churches, Ordain.church welcomed us with open arms. Our officiant was incredible.",
      rating: 5,
      type: "Same-Sex Wedding"
    },
    {
      name: "Rev. James T.",
      text: "I got ordained in minutes and officiated my best friend's wedding last month. The ceremony scripts were perfect.",
      rating: 5,
      type: "Ordained Minister"
    },
    {
      name: "Priya & David",
      text: "Our interfaith Hindu-Christian ceremony was beautiful. The resources helped us blend both traditions seamlessly.",
      rating: 5,
      type: "Interfaith Wedding"
    },
    {
      name: "Alex R.",
      text: "As a survivor of religious abuse, finding an affirming spiritual community changed my life. Thank you.",
      rating: 5,
      type: "Community Member"
    },
  ];

  const stateInfo = selectedState ? STATES_DATA.find(s => s.code === selectedState) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-purple-600 rounded-full flex items-center justify-center">
                <Church className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-700 to-purple-700 bg-clip-text text-transparent">Ordain.church</span>
                <p className="text-[10px] text-gray-500 -mt-1">by OathGate Connect</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#ordination" className="text-gray-600 hover:text-amber-700">Get Ordained</a>
              <a href="#ceremonies" className="text-gray-600 hover:text-amber-700">Ceremonies</a>
              <a href="#marriage-laws" className="text-gray-600 hover:text-amber-700">Marriage Laws</a>
              <a href="#pricing" className="text-gray-600 hover:text-amber-700">Pricing</a>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => handleAuthClick('login')} className="text-gray-700 hover:text-amber-700">
                Sign In
              </Button>
              <Button onClick={() => handleAuthClick('signup')} className="bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-700 hover:to-purple-700 text-white shadow-lg">
                Get Ordained Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="ordination" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center">
          <Badge className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
            All Are Welcome Here
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Become an Ordained
            <span className="bg-gradient-to-r from-amber-600 via-pink-500 to-purple-600 bg-clip-text text-transparent block">
              Minister Today
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Get legally ordained online in minutes. Officiate weddings, perform ceremonies, and serve your community.
            LGBTQ+ affirming, interfaith, and inclusive of all spiritual paths.
          </p>
          <p className="text-md text-gray-500 mb-8 max-w-2xl mx-auto">
            Recognized in all 50 states. No denomination requirements. No hidden fees for basic ordination.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => handleAuthClick('signup')}
              className="bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all">
              <Award className="mr-2 h-5 w-5" />
              Get Ordained Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-amber-300 hover:border-amber-500 px-8 py-4 text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Ceremony Scripts
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Ordain.church?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern, inclusive alternative to traditional ordination. Everyone deserves spiritual community.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ceremony Types */}
      <section id="ceremonies" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ceremonies You Can Perform</h2>
            <p className="text-xl text-gray-600">As an ordained minister, you can officiate any of these ceremonies.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ceremonies.map((ceremony, i) => (
              <div key={i} className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-purple-50 rounded-lg">
                <Heart className="h-4 w-4 text-pink-500 mr-2 flex-shrink-0" />
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
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-13 gap-2 mb-8 justify-center">
            {STATES_DATA.map((state) => (
              <button key={state.code} onClick={() => setSelectedState(state.code)}
                className={`px-2 py-1 text-xs font-medium rounded border transition-all ${
                  selectedState === state.code
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}>
                {state.code}
              </button>
            ))}
          </div>
          {stateInfo && (
            <Card className="max-w-2xl mx-auto border-indigo-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-700">{stateInfo.name} Marriage Laws</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">Registration Required:</span><Badge variant={stateInfo.regRequired ? "destructive" : "secondary"}>{stateInfo.regRequired ? "Yes" : "No"}</Badge></div>
                <div className="flex justify-between"><span className="text-gray-600">Waiting Period:</span><span className="font-medium">{stateInfo.waitDays === 0 ? "None" : `${stateInfo.waitDays} days`}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Witnesses Required:</span><span className="font-medium">{stateInfo.witnesses === 0 ? "None" : stateInfo.witnesses}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Same-Sex Marriage:</span><Badge className="bg-green-100 text-green-700">Legal</Badge></div>
                <div className="flex justify-between"><span className="text-gray-600">Online Ordination Accepted:</span><Badge className="bg-green-100 text-green-700">Yes</Badge></div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* LGBTQ+ & Inclusivity */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🏳️‍🌈</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Love Is Love</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ordain.church was founded on the belief that every person deserves access to spiritual community,
            regardless of sexual orientation, gender identity, race, religion, or background.
            We stand with the LGBTQ+ community and all marginalized groups.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md bg-white/80">
              <CardContent className="pt-6 text-center">
                <HeartHandshake className="h-8 w-8 text-pink-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">LGBTQ+ Affirming</h3>
                <p className="text-sm text-gray-600">We celebrate and honor same-sex marriages and all expressions of love.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white/80">
              <CardContent className="pt-6 text-center">
                <Globe className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Interfaith Welcome</h3>
                <p className="text-sm text-gray-600">All spiritual paths are honored. No single tradition is privileged over another.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white/80">
              <CardContent className="pt-6 text-center">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Survivor Safe Space</h3>
                <p className="text-sm text-gray-600">Resources and support for survivors of religious trauma and spiritual abuse.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-3">{[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-gray-600 text-sm mb-4 italic">"{t.text}"</p>
                  <div className="border-t pt-3">
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.type}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="1" className="bg-white rounded-lg shadow-sm border px-4">
              <AccordionTrigger className="text-left font-medium">Is online ordination legally valid?</AccordionTrigger>
              <AccordionContent className="text-gray-600">Yes. Online ordination is legally recognized in all 50 US states. Our ordination credentials are accepted by county clerks nationwide. We provide all necessary documentation to prove your ordination status.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="2" className="bg-white rounded-lg shadow-sm border px-4">
              <AccordionTrigger className="text-left font-medium">Can I officiate same-sex weddings?</AccordionTrigger>
              <AccordionContent className="text-gray-600">Absolutely! Same-sex marriage is legal in all 50 states, and as an ordained minister through Ordain.church, you can officiate any legal marriage ceremony regardless of the couple's gender or sexual orientation.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="3" className="bg-white rounded-lg shadow-sm border px-4">
              <AccordionTrigger className="text-left font-medium">Do I need to belong to a specific religion?</AccordionTrigger>
              <AccordionContent className="text-gray-600">No. Ordain.church is interfaith and non-denominational. We welcome people of all faiths, spiritual paths, and even those who identify as secular or non-religious. Your ordination is valid regardless of your personal beliefs.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="4" className="bg-white rounded-lg shadow-sm border px-4">
              <AccordionTrigger className="text-left font-medium">How quickly can I get ordained?</AccordionTrigger>
              <AccordionContent className="text-gray-600">The basic ordination process takes under 5 minutes. You'll receive your digital certificate immediately. Physical certificates and credential packages are shipped within 3-5 business days.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="5" className="bg-white rounded-lg shadow-sm border px-4">
              <AccordionTrigger className="text-left font-medium">What ceremonies can I perform?</AccordionTrigger>
              <AccordionContent className="text-gray-600">As an ordained minister, you can perform weddings, vow renewals, commitment ceremonies, baby blessings, naming ceremonies, memorial services, funerals, house blessings, and many other spiritual ceremonies.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="6" className="bg-white rounded-lg shadow-sm border px-4">
              <AccordionTrigger className="text-left font-medium">Is the basic ordination really free?</AccordionTrigger>
              <AccordionContent className="text-gray-600">Yes, basic ordination is completely free and always will be. We believe spiritual authority should be accessible to everyone. Premium packages with additional certificates, ID cards, and resources are available for those who want them.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing */}
      <div id="pricing">
        <SubscriptionSection onAuthClick={handleAuthClick} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Church className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Ordain.church</span>
              </div>
              <p className="text-gray-400 text-sm">Inclusive spiritual platform for ordination, ceremonies, and community. All are welcome.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Get Ordained</li>
                <li>Wedding Ceremonies</li>
                <li>Ceremony Scripts</li>
                <li>Marriage Law Guide</li>
                <li>Minister Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>LGBTQ+ Resources</li>
                <li>Interfaith Guide</li>
                <li>Survivor Support</li>
                <li>Minister Directory</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center"><Mail className="h-4 w-4 mr-2" /> support@ordain.church</li>
                <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> 1-800-ORDAIN</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2026 Ordain.church by OathGate Connect. All rights reserved. A GlowStarLabs product by Audrey Evans.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onSwitchMode={setAuthMode} />
    </div>
  );
};

export default Index;
