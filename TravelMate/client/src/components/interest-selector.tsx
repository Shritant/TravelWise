import { Utensils, Landmark, Mountain, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface InterestSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

const interestCategories = [
  {
    title: "Food & Dining",
    icon: Utensils,
    color: "terracotta",
    interests: [
      "Fine Dining",
      "Street Food", 
      "Local Cuisine",
      "Cafes",
      "Food Markets"
    ]
  },
  {
    title: "Culture & History",
    icon: Landmark,
    color: "deep-sky-blue",
    interests: [
      "Museums",
      "Historical Sites",
      "Architecture", 
      "Art Galleries",
      "Cultural Events"
    ]
  },
  {
    title: "Adventure & Nature",
    icon: Mountain,
    color: "forest-green",
    interests: [
      "Hiking",
      "Water Sports",
      "Parks & Gardens",
      "Scenic Views",
      "Wildlife"
    ]
  },
  {
    title: "Shopping & Entertainment",
    icon: ShoppingBag,
    color: "golden-sand",
    interests: [
      "Shopping Malls",
      "Local Markets",
      "Nightlife",
      "Live Music",
      "Theaters"
    ]
  }
];

export default function InterestSelector({ selectedInterests, onInterestsChange }: InterestSelectorProps) {
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      onInterestsChange(selectedInterests.filter(i => i !== interest));
    } else {
      onInterestsChange([...selectedInterests, interest]);
    }
  };

  const getButtonClasses = (interest: string, color: string) => {
    const isSelected = selectedInterests.includes(interest);
    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-colors";
    
    if (isSelected) {
      switch (color) {
        case "terracotta":
          return `${baseClasses} bg-terracotta text-white hover:bg-rust-red`;
        case "deep-sky-blue":
          return `${baseClasses} bg-deep-sky-blue text-white hover:bg-teal`;
        case "forest-green":
          return `${baseClasses} bg-forest-green text-white hover:bg-teal`;
        case "golden-sand":
          return `${baseClasses} bg-golden-sand text-passport-navy hover:bg-terracotta hover:text-white`;
        default:
          return `${baseClasses} bg-slate-gray text-white`;
      }
    } else {
      return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
    }
  };

  return (
    <div className="space-y-6">
      {interestCategories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Card key={category.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-passport-navy mb-4 flex items-center">
              <IconComponent className={`mr-3 ${
                category.color === 'terracotta' ? 'text-terracotta' :
                category.color === 'deep-sky-blue' ? 'text-deep-sky-blue' :
                category.color === 'forest-green' ? 'text-forest-green' :
                'text-golden-sand'
              }`} />
              {category.title}
            </h4>
            <div className="flex flex-wrap gap-3">
              {category.interests.map((interest) => (
                <Button
                  key={interest}
                  variant="ghost"
                  className={getButtonClasses(interest, category.color)}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Button>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
