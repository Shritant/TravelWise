import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Compass, CheckCircle, WandSparkles, Star, Utensils, Landmark, Mountain, ShoppingBag, Heart, Share, RotateCcw } from "lucide-react";
import ItineraryInput from "@/components/itinerary-input";
import InterestSelector from "@/components/interest-selector";
import RecommendationsDisplay from "@/components/recommendations-display";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { CreateRecommendation, RecommendationResponse } from "@shared/schema";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [itineraryText, setItineraryText] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [leisureTime, setLeisureTime] = useState({
    dailyHours: "",
    preferredTime: "",
    travelStyle: "",
  });
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const { toast } = useToast();

  const generateRecommendationsMutation = useMutation({
    mutationFn: async (data: CreateRecommendation) => {
      const response = await apiRequest("POST", "/api/recommendations", data);
      return response.json();
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations);
      setCurrentStep(3);
      toast({
        title: "Recommendations Generated",
        description: "Your personalized travel recommendations are ready!",
      });
    },
    onError: (error) => {
      let description = "Failed to generate recommendations";
      if (error.message.includes("API key")) {
        description = "OpenAI API key issue. Please check your API key configuration.";
      } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
        description = "API usage limit reached. Please try again later or check your OpenAI account.";
      } else if (error.message) {
        description = error.message;
      }
      
      toast({
        title: "Unable to Generate Recommendations",
        description,
        variant: "destructive",
      });
    },
  });

  const handleGenerateRecommendations = () => {
    if (!itineraryText.trim()) {
      toast({
        title: "Missing Itinerary",
        description: "Please provide your travel itinerary",
        variant: "destructive",
      });
      return;
    }

    if (selectedInterests.length === 0) {
      toast({
        title: "No Interests Selected",
        description: "Please select at least one interest",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(2);
    generateRecommendationsMutation.mutate({
      itineraryText,
      interests: selectedInterests,
      leisureTime: leisureTime.dailyHours || leisureTime.preferredTime || leisureTime.travelStyle ? leisureTime : undefined,
    });
  };

  const handleReset = () => {
    setCurrentStep(1);
    setItineraryText("");
    setSelectedInterests([]);
    setLeisureTime({ dailyHours: "", preferredTime: "", travelStyle: "" });
    setRecommendations(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Compass className="text-deep-sky-blue text-2xl mr-3" />
              <h1 className="text-xl font-bold text-passport-navy">TravelWise</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/travel-planner" className="text-slate-gray hover:text-deep-sky-blue transition-colors">Travel Planner</a>
              <a href="/recommendations" className="text-slate-gray hover:text-deep-sky-blue transition-colors">Recommendations</a>
              <a href="#how-it-works" className="text-slate-gray hover:text-deep-sky-blue transition-colors">How it works</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(var(--deep-sky-blue))] to-[hsl(var(--teal))] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Discover Your Perfect Travel Experience</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Upload your itinerary, share your interests, and get AI-powered recommendations for unforgettable travel moments.</p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <CheckCircle className="mr-2" />
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2" />
              <span>Must-visit highlights</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1 ? 'bg-deep-sky-blue text-white' : 'bg-slate-gray text-white'
              }`}>1</div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= 1 ? 'text-deep-sky-blue' : 'text-slate-gray'
              }`}>Upload Itinerary</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-gray"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2 ? 'bg-deep-sky-blue text-white' : 'bg-slate-gray text-white'
              }`}>2</div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= 2 ? 'text-deep-sky-blue' : 'text-slate-gray'
              }`}>Select Interests</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-gray"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 3 ? 'bg-deep-sky-blue text-white' : 'bg-slate-gray text-white'
              }`}>3</div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= 3 ? 'text-deep-sky-blue' : 'text-slate-gray'
              }`}>Get Recommendations</span>
            </div>
          </div>
        </div>

        {/* Step 1: Itinerary Input */}
        {currentStep === 1 && (
          <>
            <ItineraryInput 
              value={itineraryText}
              onChange={setItineraryText}
            />

            {/* Interest Selection */}
            <section className="mb-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">What Interests You?</h3>
                <p className="text-lg text-gray-600">Select your preferences to get personalized recommendations</p>
              </div>

              <InterestSelector
                selectedInterests={selectedInterests}
                onInterestsChange={setSelectedInterests}
              />
            </section>

            {/* Leisure Time Input */}
            <section className="mb-16">
              <div className="bg-golden-sand rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Available Leisure Time (Optional)</h3>
                <p className="text-gray-600 mb-6">Help us recommend activities that fit your schedule</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Daily Free Hours</label>
                    <Select value={leisureTime.dailyHours} onValueChange={(value) => setLeisureTime(prev => ({ ...prev, dailyHours: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 hours</SelectItem>
                        <SelectItem value="3-4">3-4 hours</SelectItem>
                        <SelectItem value="5-6">5-6 hours</SelectItem>
                        <SelectItem value="full-day">Full day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                    <Select value={leisureTime.preferredTime} onValueChange={(value) => setLeisureTime(prev => ({ ...prev, preferredTime: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any time</SelectItem>
                        <SelectItem value="morning">Morning (8-12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12-6 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6-10 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style</label>
                    <Select value={leisureTime.travelStyle} onValueChange={(value) => setLeisureTime(prev => ({ ...prev, travelStyle: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Flexible" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="packed">Packed schedule</SelectItem>
                        <SelectItem value="relaxed">Relaxed pace</SelectItem>
                        <SelectItem value="spontaneous">Spontaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* Generate Button */}
            <div className="text-center mb-16">
              <Button 
                className="bg-gradient-to-r from-[hsl(var(--terracotta))] to-[hsl(var(--rust-red))] text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-[hsl(var(--rust-red))] hover:to-[hsl(var(--terracotta))] transition-all transform hover:scale-105 shadow-lg"
                onClick={handleGenerateRecommendations}
                disabled={!itineraryText.trim() || selectedInterests.length === 0}
              >
                <WandSparkles className="mr-3" />
                Generate My Recommendations
              </Button>
              <p className="text-sm text-slate-gray mt-3">Powered by AI • Results in 10-15 seconds</p>
            </div>
          </>
        )}

        {/* Step 2: Loading State */}
        {currentStep === 2 && generateRecommendationsMutation.isPending && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 mb-16">
            <div className="animate-spin w-12 h-12 border-4 border-deep-sky-blue border-t-transparent rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-passport-navy mb-2">Creating Your Perfect Itinerary</h3>
            <p className="text-slate-gray">Our AI is analyzing your preferences and finding the best recommendations...</p>
            <div className="mt-6 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[hsl(var(--deep-sky-blue))] to-[hsl(var(--teal))] rounded-full animate-pulse w-3/5"></div>
            </div>
          </div>
        )}

        {/* Step 3: Recommendations Display */}
        {currentStep === 3 && recommendations && (
          <>
            <RecommendationsDisplay recommendations={recommendations} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                <Heart className="mr-2 h-4 w-4" />
                Save Recommendations
              </Button>
              <Button variant="outline" className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white">
                <Share className="mr-2 h-4 w-4" />
                Share Itinerary
              </Button>
              <Button variant="outline" className="border-slate-gray text-slate-gray hover:bg-slate-gray hover:text-white" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Generate New
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-passport-navy text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Compass className="text-deep-sky-blue text-xl mr-2" />
                <span className="text-lg font-bold">TravelWise</span>
              </div>
              <p className="text-gray-300">AI-powered travel recommendations for unforgettable experiences.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Smart Itinerary Analysis</li>
                <li>Personalized Recommendations</li>
                <li>Multi-format Upload</li>
                <li>Interest-based Matching</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>How it Works</li>
                <li>FAQ</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <div className="flex space-x-4">
                <span className="text-gray-400 hover:text-white cursor-pointer">Twitter</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Instagram</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Facebook</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
