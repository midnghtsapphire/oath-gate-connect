import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const CeremonyBuilder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<any>(null);

  const [formData, setFormData] = useState({
    partner1_name: "",
    partner2_name: "",
    partner1_pronouns: "they/them",
    partner2_pronouns: "they/them",
    ceremony_type: "traditional",
    traditions: [] as string[],
    tone: "formal",
    length: "medium",
    include_vows: true,
    include_readings: true,
    include_rituals: true,
    special_requests: "",
  });

  const traditions = [
    "Christian",
    "Jewish",
    "Muslim",
    "Hindu",
    "Buddhist",
    "Sikh",
    "Pagan",
    "Secular",
    "Humanist",
    "Spiritual",
  ];

  const handleTraditionToggle = (tradition: string) => {
    setFormData((prev) => ({
      ...prev,
      traditions: prev.traditions.includes(tradition)
        ? prev.traditions.filter((t) => t !== tradition)
        : [...prev.traditions, tradition],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.generateCeremony(formData);
      setGenerated(result);
      toast({
        title: "Ceremony Generated!",
        description: "Your AI-generated ceremony is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate ceremony",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generated) return;
    const element = document.createElement("a");
    const file = new Blob([generated.ceremony_script], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `ceremony-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <Sparkles className="inline h-8 w-8 mr-2 text-amber-600" />
            AI Ceremony Builder
          </h1>
          <p className="text-xl text-gray-600">
            Generate a custom, beautiful wedding ceremony with AI. Interfaith, LGBTQ+, traditional, or secular.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Create Your Ceremony</CardTitle>
              <CardDescription>Fill in the details and let AI generate your perfect ceremony</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partner1">Partner 1 Name</Label>
                    <Input
                      id="partner1"
                      value={formData.partner1_name}
                      onChange={(e) => setFormData({ ...formData, partner1_name: e.target.value })}
                      placeholder="Alex"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner2">Partner 2 Name</Label>
                    <Input
                      id="partner2"
                      value={formData.partner2_name}
                      onChange={(e) => setFormData({ ...formData, partner2_name: e.target.value })}
                      placeholder="Jordan"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pronouns1">Pronouns 1</Label>
                    <Select value={formData.partner1_pronouns} onValueChange={(v) => setFormData({ ...formData, partner1_pronouns: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="he/him">he/him</SelectItem>
                        <SelectItem value="she/her">she/her</SelectItem>
                        <SelectItem value="they/them">they/them</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pronouns2">Pronouns 2</Label>
                    <Select value={formData.partner2_pronouns} onValueChange={(v) => setFormData({ ...formData, partner2_pronouns: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="he/him">he/him</SelectItem>
                        <SelectItem value="she/her">she/her</SelectItem>
                        <SelectItem value="they/them">they/them</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">Ceremony Type</Label>
                  <Select value={formData.ceremony_type} onValueChange={(v) => setFormData({ ...formData, ceremony_type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="interfaith">Interfaith</SelectItem>
                      <SelectItem value="lgbtq">LGBTQ+ Affirming</SelectItem>
                      <SelectItem value="secular">Secular</SelectItem>
                      <SelectItem value="spiritual">Spiritual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Traditions to Include</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {traditions.map((tradition) => (
                      <div key={tradition} className="flex items-center space-x-2">
                        <Checkbox
                          id={tradition}
                          checked={formData.traditions.includes(tradition)}
                          onCheckedChange={() => handleTraditionToggle(tradition)}
                        />
                        <Label htmlFor={tradition} className="font-normal cursor-pointer">
                          {tradition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={formData.tone} onValueChange={(v) => setFormData({ ...formData, tone: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="romantic">Romantic</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="length">Length</Label>
                    <Select value={formData.length} onValueChange={(v) => setFormData({ ...formData, length: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (15 min)</SelectItem>
                        <SelectItem value="medium">Medium (30 min)</SelectItem>
                        <SelectItem value="long">Long (45 min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vows"
                      checked={formData.include_vows}
                      onCheckedChange={(checked) => setFormData({ ...formData, include_vows: checked as boolean })}
                    />
                    <Label htmlFor="vows" className="font-normal">Include personalized vows</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="readings"
                      checked={formData.include_readings}
                      onCheckedChange={(checked) => setFormData({ ...formData, include_readings: checked as boolean })}
                    />
                    <Label htmlFor="readings" className="font-normal">Include readings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rituals"
                      checked={formData.include_rituals}
                      onCheckedChange={(checked) => setFormData({ ...formData, include_rituals: checked as boolean })}
                    />
                    <Label htmlFor="rituals" className="font-normal">Include rituals</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                    placeholder="Any special requests? (optional)"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Ceremony
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview */}
          <div>
            {generated ? (
              <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Your Ceremony</CardTitle>
                  <CardDescription>
                    {generated.estimated_duration_minutes} minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <pre className="bg-gray-50 p-4 rounded text-xs whitespace-pre-wrap font-mono">
                      {generated.ceremony_script}
                    </pre>
                  </div>
                </CardContent>
                <div className="p-6 border-t space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Ceremony
                  </Button>
                  <Button
                    onClick={() => setGenerated(null)}
                    variant="outline"
                    className="w-full"
                  >
                    Generate Another
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Sparkles className="h-16 w-16 text-amber-600 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-600 text-lg">
                    Fill in the form and click "Generate Ceremony" to create your custom wedding ceremony with AI.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CeremonyBuilder;
