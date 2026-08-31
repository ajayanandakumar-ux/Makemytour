import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, Flag, MessageSquare, Image, Send, X, AlertTriangle } from "lucide-react";
import { getReviews, addReview, addReply, markHelpful, flagReview } from "../api";
import { Button } from "./ui/button";

interface ReviewsSectionProps {
  entityType: "FLIGHT" | "HOTEL";
  entityId: String;
  currentUser: any;
}

export default function ReviewsSection({ entityType, entityId, currentUser }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [photosList, setPhotosList] = useState<string[]>([
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
  ]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  
  // Flag modal state
  const [flagModalReviewId, setFlagModalReviewId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState("Inappropriate language or offensive content");

  const fetchReviewsData = async () => {
    try {
      const data = await getReviews(entityType, String(entityId), sortBy);
      setReviews(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, [entityType, entityId, sortBy]);

  const handleAddPhoto = () => {
    if (photoUrlInput.trim()) {
      setPhotosList([...photosList, photoUrlInput.trim()]);
      setPhotoUrlInput("");
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotosList(photosList.filter((_, i) => i !== index));
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addReview({
        entityType,
        entityId,
        userId: currentUser?.id || "guest-user",
        userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Verified Traveler",
        rating,
        comment,
        photoUrls: photosList,
      });
      setComment("");
      setPhotosList([
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
      ]);
      fetchReviewsData();
    } catch (e) {
      alert("Failed to submit review");
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await markHelpful(reviewId);
      fetchReviewsData();
    } catch (e) {}
  };

  const submitFlagReview = async () => {
    if (!flagModalReviewId) return;
    try {
      await flagReview(flagModalReviewId, flagReason);
      setFlagModalReviewId(null);
      fetchReviewsData();
    } catch (e) {}
  };

  const handlePostReply = async (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text?.trim()) return;

    try {
      await addReply(
        reviewId,
        currentUser?.id || "guest",
        currentUser ? `${currentUser.firstName}` : "Traveler",
        text
      );
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
      setActiveReplyId(null);
      fetchReviewsData();
    } catch (e) {}
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            User Reviews & Ratings
          </h3>
          <p className="text-sm text-gray-500">Real feedback & photo reviews from verified travelers</p>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="most_helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleAddReview} className="bg-blue-50/50 rounded-xl p-5 mb-8 border border-blue-100">
        <h4 className="font-semibold text-sm text-gray-800 mb-2">Write a Detailed Review</h4>
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
          <span className="ml-2 text-sm font-bold text-gray-700">{rating} / 5 Stars</span>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your detailed experience (cleanliness, comfort, service, location)..."
          className="w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          rows={3}
        />

        {/* Photo Upload Attachment Control */}
        <div className="mt-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <Image className="w-3.5 h-3.5 text-blue-600" /> Upload Photos (Paste Image URL)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="https://images.unsplash.com/your-photo.jpg"
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              className="flex-1 border text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
            <button
              type="button"
              onClick={handleAddPhoto}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium"
            >
              Attach Photo
            </button>
          </div>
          {photosList.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {photosList.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="Uploaded preview" className="w-16 h-12 object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 text-[10px]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">Your review helps future travelers make great choices.</span>
          <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
            Submit Review
          </Button>
        </div>
      </form>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    {rev.userName ? rev.userName[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">{rev.userName}</h5>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {rev.flagged && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Flagged for Moderation
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-sm mb-3">{rev.comment}</p>

              {/* Photo Upload Thumbnail Preview */}
              {rev.photoUrls && rev.photoUrls.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {rev.photoUrls.map((url: string, i: number) => (
                    <img
                      key={i}
                      src={url}
                      alt="User review attachment"
                      className="w-24 h-18 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  ))}
                </div>
              )}

              {/* Helpful & Action Buttons */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.helpfulCount || 0})
                </button>

                <button
                  onClick={() => setActiveReplyId(activeReplyId === rev.id ? null : rev.id)}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Reply ({rev.replies?.length || 0})
                </button>

                <button
                  onClick={() => setFlagModalReviewId(rev.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors ml-auto"
                >
                  <Flag className="w-3.5 h-3.5" /> Flag Inappropriate
                </button>
              </div>

              {/* Replies Thread */}
              {rev.replies && rev.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-blue-200 space-y-2 bg-gray-50/70 p-3 rounded-r-lg">
                  {rev.replies.map((reply: any, idx: number) => (
                    <div key={idx} className="text-xs">
                      <span className="font-semibold text-gray-900">{reply.userName}: </span>
                      <span className="text-gray-700">{reply.comment}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input Box */}
              {activeReplyId === rev.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a public reply..."
                    value={replyText[rev.id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [rev.id]: e.target.value })
                    }
                    className="flex-1 border text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-blue-600 text-white"
                    onClick={() => handlePostReply(rev.id)}
                  >
                    <Send className="w-3 h-3 mr-1" /> Reply
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Flag Review Modal */}
      {flagModalReviewId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 text-red-600">
              <Flag className="w-5 h-5" /> Flag Inappropriate Content
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Flagged content will be sent directly to platform moderators for review.
            </p>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Flagging:</label>
            <select
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm mb-6 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Inappropriate language or offensive content">Inappropriate language or offensive content</option>
              <option value="Spam or misleading information">Spam or misleading information</option>
              <option value="Harassment or personal attack">Harassment or personal attack</option>
              <option value="Fake review or conflict of interest">Fake review or conflict of interest</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={submitFlagReview}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition"
              >
                Submit Flag
              </button>
              <button
                onClick={() => setFlagModalReviewId(null)}
                className="px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
