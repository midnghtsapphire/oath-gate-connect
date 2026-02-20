import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, Award, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const CertificateGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<any>(null);

  const [ordinationData, setOrdinationData] = useState({
    minister_name: "",
    denomination: "Universal Life Church",
    specializations: [] as string[],
  });

  const [marriageData, setMarriageData] = useState({
    partner1_name: "",
    partner2_name: "",
    officiant_name: "",
    ceremony_date: "",
    ceremony_location: "",
  });

  const handleGenerateOrdination = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.generateOrdinationCertificate(ordinationData);
      setGenerated(result);
      toast({
        title: "Certificate Generated!",
        description: "Your ordination certificate is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate certificate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMarriage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.generateMarriageCertificate(marriageData);
      setGenerated(result);
      toast({
        title: "Certificate Generated!",
        description: "Your marriage certificate is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate certificate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generated?.pdf_url) return;
    window.open(generated.pdf_url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <Award className="inline h-8 w-8 mr-2 text-amber-600" />
            Certificate Generator
          </h1>
          <p className="text-xl text-gray-600">
            Generate official certificates with QR codes for verification.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Forms */}
          <div>
            <Tabs defaultValue="ordination" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ordination">Ordination</TabsTrigger>
                <TabsTrigger value="marriage">Marriage</TabsTrigger>
              </TabsList>

              <TabsContent value="ordination">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Ordination Certificate</CardTitle>
                    <CardDescription>Generate your official ordination certificate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGenerateOrdination} className="space-y-6">
                      <div>
                        <Label htmlFor="minister_name">Minister Name</Label>
                        <Input
                          id="minister_name"
                          value={ordinationData.minister_name}
                          onChange={(e) => setOrdinationData({ ...ordinationData, minister_name: e.target.value })}
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="denomination">Denomination</Label>
                        <Input
                          id="denomination"
                          value={ordinationData.denomination}
                          onChange={(e) => setOrdinationData({ ...ordinationData, denomination: e.target.value })}
                          placeholder="Universal Life Church"
                        />
                      </div>

                      <div>
                        <Label>Specializations (comma-separated)</Label>
                        <Input
                          placeholder="e.g., Weddings, Funerals, Interfaith"
                          onChange={(e) =>
                            setOrdinationData({
                              ...ordinationData,
                              specializations: e.target.value.split(",").map((s) => s.trim()),
                            })
                          }
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
                            <Award className="mr-2 h-4 w-4" />
                            Generate Certificate
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="marriage">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Marriage Certificate</CardTitle>
                    <CardDescription>Generate an official marriage certificate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGenerateMarriage} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="partner1_name">Partner 1 Name</Label>
                          <Input
                            id="partner1_name"
                            value={marriageData.partner1_name}
                            onChange={(e) => setMarriageData({ ...marriageData, partner1_name: e.target.value })}
                            placeholder="First partner"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="partner2_name">Partner 2 Name</Label>
                          <Input
                            id="partner2_name"
                            value={marriageData.partner2_name}
                            onChange={(e) => setMarriageData({ ...marriageData, partner2_name: e.target.value })}
                            placeholder="Second partner"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="officiant_name">Officiant Name</Label>
                        <Input
                          id="officiant_name"
                          value={marriageData.officiant_name}
                          onChange={(e) => setMarriageData({ ...marriageData, officiant_name: e.target.value })}
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ceremony_date">Ceremony Date</Label>
                          <Input
                            id="ceremony_date"
                            type="date"
                            value={marriageData.ceremony_date}
                            onChange={(e) => setMarriageData({ ...marriageData, ceremony_date: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="ceremony_location">Location</Label>
                          <Input
                            id="ceremony_location"
                            value={marriageData.ceremony_location}
                            onChange={(e) => setMarriageData({ ...marriageData, ceremony_location: e.target.value })}
                            placeholder="City, State"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-4 w-4" />
                            Generate Certificate
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div>
            {generated ? (
              <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Certificate Generated</CardTitle>
                  <CardDescription>ID: {generated.certificate_id}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    {generated.qr_code_data && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Verification QR Code:</p>
                        <img
                          src={generated.qr_code_data}
                          alt="QR Code"
                          className="w-48 h-48 mx-auto border-2 border-gray-200 rounded"
                        />
                      </div>
                    )}
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-gray-600">
                        <strong>Verification URL:</strong>
                      </p>
                      <p className="text-xs text-blue-600 break-all mt-1">{generated.verification_url}</p>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 border-t space-y-3">
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
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
                  <Award className="h-16 w-16 text-amber-600 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-600 text-lg">
                    Fill in the form and generate your official certificate with QR code verification.
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

export default CertificateGenerator;
