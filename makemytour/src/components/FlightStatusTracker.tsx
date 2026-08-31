import React, { useState, useEffect } from "react";
import { Plane, Clock, AlertTriangle, CheckCircle, Bell, Plus, Trash2, Radio } from "lucide-react";
import { getFlightStatus, getAllFlightStatuses } from "../api";

interface FlightStatusTrackerProps {
  flightId?: string;
}

export default function FlightStatusTracker({ flightId }: FlightStatusTrackerProps) {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState<string>(flightId || "AI-101");
  const [activeStatus, setActiveStatus] = useState<any>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial mock flights list for multi-flight watchlist
  const mockWatchlistInitial = [
    {
      flightId: "AI-101",
      flightName: "Air India AI-101",
      from: "Delhi (DEL)",
      to: "Mumbai (BOM)",
      status: "DELAYED",
      delayMinutes: 45,
      delayReason: "Late arrival of incoming aircraft due to dense fog in Delhi.",
      originalDeparture: "08:00 AM",
      revisedDeparture: "08:45 AM",
      estimatedArrival: "11:00 AM",
      terminal: "T3",
      gate: "Gate 14",
    },
    {
      flightId: "6E-204",
      flightName: "IndiGo 6E-204",
      from: "Mumbai (BOM)",
      to: "Bengaluru (BLR)",
      status: "BOARDING",
      delayMinutes: 0,
      delayReason: "On schedule - Boarding at Gate 7",
      originalDeparture: "10:30 AM",
      revisedDeparture: "10:30 AM",
      estimatedArrival: "12:15 PM",
      terminal: "T2",
      gate: "Gate 07",
    },
    {
      flightId: "UK-812",
      flightName: "Vistara UK-812",
      from: "Bengaluru (BLR)",
      to: "Goa (GOI)",
      status: "ON_TIME",
      delayMinutes: 0,
      delayReason: "Weather clear - All systems operational",
      originalDeparture: "02:15 PM",
      revisedDeparture: "02:15 PM",
      estimatedArrival: "03:30 PM",
      terminal: "T1",
      gate: "Gate 03",
    },
  ];

  useEffect(() => {
    async function loadData() {
      let data = null;
      if (flightId) {
        data = await getFlightStatus(flightId);
      }
      if (data) {
        setActiveStatus(data);
        setWatchlist((prev) => {
          if (!prev.some((f) => f.flightId === data.flightId)) {
            return [data, ...prev];
          }
          return prev;
        });
      } else {
        setWatchlist(mockWatchlistInitial);
        setActiveStatus(mockWatchlistInitial[0]);
      }
    }
    loadData();
  }, [flightId]);

  const handleSelectFlight = (flight: any) => {
    setSelectedFlightId(flight.flightId);
    setActiveStatus(flight);
  };

  const handleToggleNotification = async () => {
    if (!subscribed) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("MakeMyTour Flight Tracking Active", {
            body: `Push alerts enabled for Flight ${activeStatus?.flightName || "AI-101"}. We'll notify you of delays or gate changes.`,
            icon: "/favicon.ico",
          });
        }
      }
      setSubscribed(true);
      setToastMessage("Push Notifications Enabled for Flight Status Updates!");
    } else {
      setSubscribed(false);
      setToastMessage("Push Alerts Turned Off.");
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!activeStatus) return null;

  const isDelayed = activeStatus.status === "DELAYED";
  const isBoarding = activeStatus.status === "BOARDING";

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-blue-800/40 my-6">
      {/* Header & Watchlist Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-800/50 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/30 rounded-xl border border-blue-500/40 shadow-inner">
            <Plane className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-xl text-white flex items-center gap-2">
              Live Flight Status Tracker
            </h4>
            <p className="text-xs text-blue-200">
              Simulated real-time flight telemetry, delay reasons & push alerts
            </p>
          </div>
        </div>

        {/* Multi-Flight Watchlist Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-blue-300 font-semibold flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" /> Watchlist:
          </span>
          {watchlist.map((item) => (
            <button
              key={item.flightId}
              onClick={() => handleSelectFlight(item)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFlightId === item.flightId
                  ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-md"
                  : "bg-blue-900/50 hover:bg-blue-800/60 text-blue-200"
              }`}
            >
              {item.flightId}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-4 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg p-3 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toastMessage}
        </div>
      )}

      {/* Selected Flight Details & Push Alerts */}
      <div className="bg-blue-950/60 rounded-xl p-5 border border-blue-800/50 mb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{activeStatus.flightName}</span>
              <span className="text-xs bg-blue-900/80 text-blue-300 px-2 py-0.5 rounded font-mono">
                {activeStatus.flightId}
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              {activeStatus.from} → {activeStatus.to} | Gate: <span className="text-white font-bold">{activeStatus.gate}</span> | Terminal: <span className="text-white font-bold">{activeStatus.terminal}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow ${
                isDelayed
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                  : isBoarding
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
              }`}
            >
              {isDelayed ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Delayed by {activeStatus.delayMinutes || 45}m
                </>
              ) : isBoarding ? (
                <>
                  <Radio className="w-3.5 h-3.5 text-purple-400" /> Now Boarding
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> On Time
                </>
              )}
            </span>

            {/* Notification Toggle Button */}
            <button
              onClick={handleToggleNotification}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shadow ${
                subscribed
                  ? "bg-blue-600 text-white ring-2 ring-blue-400"
                  : "bg-slate-800 hover:bg-slate-700 text-blue-200 border border-blue-700/50"
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${subscribed ? "fill-white" : ""}`} />
              {subscribed ? "Push Alerts Enabled" : "Enable Push Alerts"}
            </button>
          </div>
        </div>

        {/* Detailed Context & Reason Banner */}
        <div className={`p-3.5 rounded-lg text-xs mb-2 flex items-start gap-2.5 ${
          isDelayed
            ? "bg-amber-950/50 border border-amber-700/60 text-amber-200"
            : "bg-blue-900/40 border border-blue-700/50 text-blue-200"
        }`}>
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isDelayed ? "text-amber-400" : "text-blue-400"}`} />
          <div>
            <span className="font-semibold text-white">Status Context & Telemetry: </span>
            {activeStatus.delayReason || "Normal flight operations. Aircraft on track."} Revised departure:{" "}
            <span className="font-bold text-white">{activeStatus.revisedDeparture || activeStatus.originalDeparture}</span>.
          </div>
        </div>
      </div>

      {/* Schedule Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900/60">
          <span className="text-blue-300 block mb-1">Scheduled Departure</span>
          <span className="font-semibold text-sm text-white">{activeStatus.originalDeparture}</span>
        </div>

        <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900/60">
          <span className="text-blue-300 block mb-1">Revised Departure</span>
          <span className={`font-semibold text-sm ${isDelayed ? "text-amber-300 font-bold" : "text-white"}`}>
            {activeStatus.revisedDeparture}
          </span>
        </div>

        <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900/60">
          <span className="text-blue-300 block mb-1">Estimated Arrival</span>
          <span className="font-semibold text-sm text-white">{activeStatus.estimatedArrival}</span>
        </div>

        <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900/60">
          <span className="text-blue-300 block mb-1">Live Feed Sync</span>
          <span className="font-semibold text-xs text-emerald-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Updated just now
          </span>
        </div>
      </div>
    </div>
  );
}
