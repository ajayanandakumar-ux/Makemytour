import React, { useState } from "react";
import { Check, Sparkles, Building, Armchair, Eye, Bookmark, X } from "lucide-react";
import { useSelector } from "react-redux";
import { saveUserPreferences } from "@/api";

interface SeatAndRoomSelectorProps {
  type: "FLIGHT" | "HOTEL";
  onSelectPreference: (preference: string, extraCost: number) => void;
}

export default function SeatAndRoomSelector({ type, onSelectPreference }: SeatAndRoomSelectorProps) {
  const user = useSelector((state: any) => state.user.user);
  const [selectedSeat, setSelectedSeat] = useState<string>(user?.preferredSeat || "12A");
  const [selectedRoom, setSelectedRoom] = useState<string>(user?.preferredRoomType || "Deluxe Ocean View");
  const [previewRoom, setPreviewRoom] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Mock flight seats layout
  const seats = [
    { code: "10A", category: "Extra Legroom (Window)", price: 600, tag: "Emergency Row" },
    { code: "10B", category: "Extra Legroom (Aisle)", price: 600, tag: "Emergency Row" },
    { code: "12A", category: "Standard Window", price: 0, tag: "Standard" },
    { code: "12B", category: "Standard Aisle", price: 0, tag: "Standard" },
    { code: "14A", category: "Premium Front Row (Window)", price: 1200, tag: "VIP Priority" },
    { code: "14B", category: "Premium Front Row (Aisle)", price: 1200, tag: "VIP Priority" },
  ];

  // Mock hotel room layout with 3D preview data
  const rooms = [
    {
      title: "Standard Deluxe Room",
      code: "Standard Deluxe",
      extraCost: 0,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
      features: "King Bed, City View, Free High-Speed WiFi, Work Desk",
      preview3d: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      description: "Elegant 320 sq.ft room with modern decor, plush king bed, and panoramic city views."
    },
    {
      title: "Premium Ocean View Suite",
      code: "Deluxe Ocean View",
      extraCost: 2500,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      features: "Private Balcony, Ocean View, Breakfast Included, Spa Access",
      preview3d: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      description: "Spacious 550 sq.ft suite with private sun-drenched balcony overlooking the ocean and inclusive hydrotherapy spa access."
    },
    {
      title: "Executive Luxury Suite",
      code: "Executive Suite",
      extraCost: 4500,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      features: "Plunge Pool, Lounge Access, 24/7 Butler Service, Oceanfront View",
      preview3d: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      description: "Ultra-luxurious 850 sq.ft suite featuring a private infinity plunge pool, personalized butler, and executive lounge privileges."
    },
  ];

  const handleSeatClick = (seatCode: string, extraCost: number) => {
    setSelectedSeat(seatCode);
    onSelectPreference(seatCode, extraCost);
  };

  const handleRoomClick = (roomCode: string, extraCost: number) => {
    setSelectedRoom(roomCode);
    onSelectPreference(roomCode, extraCost);
  };

  const handleSavePreference = async () => {
    if (!user?.id) return;
    try {
      if (type === "FLIGHT") {
        await saveUserPreferences(user.id, selectedSeat, null);
        setSavedSuccess(`Saved Seat ${selectedSeat} as your default flight preference!`);
      } else {
        await saveUserPreferences(user.id, null, selectedRoom);
        setSavedSuccess(`Saved ${selectedRoom} as your default hotel room preference!`);
      }
      setTimeout(() => setSavedSuccess(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  if (type === "FLIGHT") {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 my-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            <Armchair className="w-5 h-5 text-blue-600" /> Interactive Flight Seat Map & Upselling
          </h4>
          {user?.id && (
            <button
              onClick={handleSavePreference}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
            >
              <Bookmark className="w-3.5 h-3.5" /> Save Preference to Profile
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Select premium front-row or extra legroom seats with clear upselling pricing
        </p>

        {savedSuccess && (
          <div className="mb-4 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> {savedSuccess}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {seats.map((seat) => (
            <div
              key={seat.code}
              onClick={() => handleSeatClick(seat.code, seat.price)}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedSeat === seat.code
                  ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm"
                  : "border-gray-200 hover:border-blue-300 bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-base text-gray-900">Seat {seat.code}</span>
                {seat.price > 0 ? (
                  <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                    +₹{seat.price}
                  </span>
                ) : (
                  <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded">
                    Included
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500 block">{seat.category}</span>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{seat.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 my-6 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" /> Interactive Room Grid & 3D Previews
        </h4>
        {user?.id && (
          <button
            onClick={handleSavePreference}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
          >
            <Bookmark className="w-3.5 h-3.5" /> Save Preference to Profile
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Explore 3D room preview cards and upgrade options with transparent pricing
      </p>

      {savedSuccess && (
        <div className="mb-4 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" /> {savedSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.code}
            onClick={() => handleRoomClick(room.code, room.extraCost)}
            className={`border rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
              selectedRoom === room.code
                ? "border-blue-600 ring-2 ring-blue-500/30 shadow-md bg-blue-50/20"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="relative h-36">
              <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
              {selectedRoom === room.code && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewRoom(room);
                }}
                className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm transition"
              >
                <Eye className="w-3.5 h-3.5" /> 3D Preview
              </button>
            </div>
            <div className="p-3 bg-white flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-bold text-sm text-gray-900 truncate">{room.title}</h5>
                  {room.extraCost > 0 ? (
                    <span className="text-xs text-blue-700 font-bold whitespace-nowrap">
                      +₹{room.extraCost}/night
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold">Included</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{room.features}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Room Preview Modal */}
      {previewRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative h-64 md:h-80 bg-gray-900">
              <img src={previewRoom.preview3d} alt={previewRoom.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setPreviewRoom(null)}
                className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full hover:bg-black transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow">
                <Sparkles className="w-3.5 h-3.5" /> 3D Virtual Tour Preview
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{previewRoom.title}</h3>
                  <p className="text-xs text-gray-500">{previewRoom.features}</p>
                </div>
                <span className="text-base font-bold text-blue-600">
                  {previewRoom.extraCost > 0 ? `+₹${previewRoom.extraCost}/night` : "Included"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-6">{previewRoom.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleRoomClick(previewRoom.code, previewRoom.extraCost);
                    setPreviewRoom(null);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium text-sm transition"
                >
                  Select This Room Type
                </button>
                <button
                  onClick={() => setPreviewRoom(null)}
                  className="px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-medium text-sm transition"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
