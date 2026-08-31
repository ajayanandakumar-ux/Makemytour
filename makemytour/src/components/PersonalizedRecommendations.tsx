import React, { useState, useEffect } from "react";
import { Sparkles, ThumbsUp, ThumbsDown, Info, Compass } from "lucide-react";
import { getRecommendations, recordRecommendationFeedback } from "../api";
import { Button } from "./ui/button";

interface PersonalizedRecommendationsProps {
  currentUser: any;
}

export default function PersonalizedRecommendations({ currentUser }: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<{ [key: string]: boolean | null }>({});

  useEffect(() => {
    async function loadRecs() {
      const data = await getRecommendations(currentUser?.id || "guest");
      setRecommendations(data || []);
    }
    loadRecs();
  }, [currentUser]);

  const handleFeedback = async (recId: string, helpful: boolean) => {
    try {
      await recordRecommendationFeedback(
        currentUser?.id || "guest",
        recId,
        "HOTEL",
        helpful
      );
      setFeedbackState((prev) => ({ ...prev, [recId]: helpful }));
    } catch (e) {}
  };

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 fill-amber-300" /> Recommended For You
          </h2>
          <p className="text-sm text-gray-300">
            Smart personalized travel picks based on your browsing history & preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> {rec.category || "Beach"}
                </span>

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveTooltip(activeTooltip === rec.id ? null : rec.id)
                    }
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 px-2 py-1 rounded-md"
                  >
                    <Info className="w-3.5 h-3.5" /> Why this?
                  </button>

                  {/* "Why this recommendation?" Tooltip */}
                  {activeTooltip === rec.id && (
                    <div className="absolute right-0 top-7 w-64 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-20 border border-slate-700">
                      <p className="font-semibold text-amber-300 mb-1">Recommendation Insights:</p>
                      <p className="text-gray-200 leading-relaxed">{rec.reason}</p>
                      <span className="mt-2 block text-[10px] text-blue-400 font-bold">
                        Algorithm Match: {rec.matchScore}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-1">{rec.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{rec.location}</p>
              <p className="text-xs text-gray-600 mb-4 line-clamp-2">{rec.amenities}</p>

              <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 block">Starting from</span>
                  <span className="text-lg font-extrabold text-blue-600">
                    ₹{rec.pricePerNight}
                  </span>
                  <span className="text-xs text-gray-500"> / night</span>
                </div>
                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Book Pick
                </Button>
              </div>
            </div>

            {/* Recommendation Feedback Loop */}
            <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-100 flex justify-between items-center text-xs text-gray-600">
              <span>Is this recommendation helpful?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback(rec.id, true)}
                  className={`p-1.5 rounded hover:bg-emerald-100 ${
                    feedbackState[rec.id] === true ? "text-emerald-600 font-bold" : "text-gray-500"
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFeedback(rec.id, false)}
                  className={`p-1.5 rounded hover:bg-red-100 ${
                    feedbackState[rec.id] === false ? "text-red-600 font-bold" : "text-gray-500"
                  }`}
                  title="Not relevant"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
