import { Star, Utensils, Landmark, Mountain, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { RecommendationResponse } from "@shared/schema";

interface RecommendationsDisplayProps {
  recommendations: RecommendationResponse;
}

export default function RecommendationsDisplay({ recommendations }: RecommendationsDisplayProps) {
  const { mustVisitPlaces, personalizedRecommendations } = recommendations;

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Personalized Recommendations</h3>
        <p className="text-lg text-gray-600">Based on your interests and available time</p>
      </div>

      {/* Must-Visit Places */}
      <div className="mb-12">
        <h4 className="text-2xl font-bold text-passport-navy mb-6 flex items-center">
          <Star className="text-golden-sand mr-3" />
          Must-Visit Highlights
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mustVisitPlaces.map((place, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-2">{place.name}</h5>
                <p className="text-gray-600 mb-3">{place.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{place.duration}</span>
                  <div className="flex items-center">
                    <Star className="text-golden-sand mr-1 h-4 w-4" />
                    <span className="text-sm font-medium">{place.rating}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="space-y-8">
        {/* Food & Dining */}
        {personalizedRecommendations.food && personalizedRecommendations.food.length > 0 && (
          <div>
            <h4 className="text-2xl font-bold text-passport-navy mb-6 flex items-center">
              <Utensils className="text-terracotta mr-3" />
              Food & Dining Recommendations
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              {personalizedRecommendations.food.map((restaurant, index) => (
                <Card key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Utensils className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-gray-900 mb-1">{restaurant.name}</h5>
                      <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-terracotta font-medium">{restaurant.priceRange}</span>
                        <span className="text-sm text-gray-500">{restaurant.matchReason}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Cultural Experiences */}
        {personalizedRecommendations.culture && personalizedRecommendations.culture.length > 0 && (
          <div>
            <h4 className="text-2xl font-bold text-passport-navy mb-6 flex items-center">
              <Landmark className="text-deep-sky-blue mr-3" />
              Cultural Experiences
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              {personalizedRecommendations.culture.map((activity, index) => (
                <Card key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Landmark className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-gray-900 mb-1">{activity.name}</h5>
                      <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-deep-sky-blue font-medium">{activity.duration}</span>
                        <span className="text-sm text-gray-500">{activity.matchReason}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Nature & Outdoor Activities */}
        {personalizedRecommendations.nature && personalizedRecommendations.nature.length > 0 && (
          <div>
            <h4 className="text-2xl font-bold text-passport-navy mb-6 flex items-center">
              <Mountain className="text-forest-green mr-3" />
              Nature & Outdoor Activities
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              {personalizedRecommendations.nature.map((activity, index) => (
                <Card key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Mountain className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-gray-900 mb-1">{activity.name}</h5>
                      <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-forest-green font-medium">{activity.duration}</span>
                        <span className="text-sm text-gray-500">{activity.matchReason}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Shopping & Entertainment */}
        {personalizedRecommendations.shopping && personalizedRecommendations.shopping.length > 0 && (
          <div>
            <h4 className="text-2xl font-bold text-passport-navy mb-6 flex items-center">
              <ShoppingBag className="text-golden-sand mr-3" />
              Shopping & Entertainment
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              {personalizedRecommendations.shopping.map((activity, index) => (
                <Card key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-gray-900 mb-1">{activity.name}</h5>
                      <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-golden-sand font-medium">{activity.duration}</span>
                        <span className="text-sm text-gray-500">{activity.matchReason}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
