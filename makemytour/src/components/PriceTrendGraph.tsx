import React, { useState, useEffect } from "react";
import { TrendingUp, Lock, ShieldCheck, Zap, Clock, CheckCircle2 } from "lucide-react";
import { getPriceHistory, freezePrice } from "../api";
import { Button } from "./ui/button";

interface PriceTrendGraphProps {
  entityType: "FLIGHT" | "HOTEL";
  entityId: string;
  basePrice: number;
  currentUser: any;
}

export default function PriceTrendGraph({ entityType, entityId, basePrice, currentUser }: PriceTrendGraphProps) {
  const [pricingData, setPricingData] = useState<any>(null);
  const [locked, setLocked] = useState(false);
  const [freezeHoursLeft, setFreezeHoursLeft] = useState(24);

  useEffect(() => {
    async function loadPricing() {
      if (!entityId) return;
      const data = await getPriceHistory(entityType, entityId, basePrice);
      setPricingData(data);
    }
    loadPricing();
  }, [entityType, entityId, basePrice]);

  const handleFreezePrice = async () => {
    try {
      await freezePrice(
        entityType,
        entityId,
        currentUser?.id || "guest",
        pricingData?.currentPrice || basePrice * 1.20
      );
      setLocked(true);
      setFreezeHoursLeft(24);
    } catch (e) {
      alert("Could not freeze price.");
    }
  };

  if (!pricingData) return null;

  const points = pricingData.history || [
    { date: "14 Days Ago", price: basePrice * 0.85 },
    { date: "7 Days Ago", price: basePrice * 0.95 },
    { date: "3 Days Ago", price: basePrice * 1.10 },
    { date: "Today (Peak)", price: basePrice * 1.20 }
  ];

  const maxPrice = Math.max(...points.map((p: any) => p.price));
  const minPrice = Math.min(...points.map((p: any) => p.price));

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/60 rounded-2xl border border-indigo-100 p-6 my-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-indigo-100">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-400" /> Dynamic Pricing Engine
            </h4>
            <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
              Peak Season Surge (+20%)
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Automated real-time price adjustment based on holiday demand & seasonal trends
          </p>
        </div>

        {/* Price Freeze Button & Status */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleFreezePrice}
            disabled={locked}
            className={`h-10 text-xs font-semibold px-4 rounded-xl transition-all shadow-sm ${
              locked
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-200"
            }`}
          >
            {locked ? (
              <>
                <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-200" /> Locked at ₹{Math.round(pricingData.currentPrice || basePrice * 1.2)}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-1.5" /> Freeze Price at ₹{Math.round(pricingData.currentPrice || basePrice * 1.2)}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Freeze Confirmation Alert Banner */}
      {locked && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-800 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="font-semibold">Price Lock Guaranteed!</strong> Fares are locked for your account for the next 24 hours. No future surge price increases will affect your rate.
            </span>
          </div>
          <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-emerald-600" /> {freezeHoursLeft}h 00m left
          </span>
        </div>
      )}

      {/* SVG Price History Graph Visualization */}
      <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> 14-Day Dynamic Fare Fluctuations
          </h5>
          <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
            Live Telemetry Feed
          </span>
        </div>

        {/* Bar & SVG Curve Graph */}
        <div className="grid grid-cols-4 gap-3 pt-2">
          {points.map((pt: any, i: number) => {
            const heightPercent = Math.max(30, Math.round(((pt.price - minPrice * 0.8) / (maxPrice - minPrice * 0.8 || 1)) * 100));
            const isHighest = pt.price === maxPrice;
            return (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-full bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col items-center justify-end h-28 relative overflow-hidden transition-all group-hover:border-indigo-300">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isHighest
                        ? "bg-gradient-to-t from-amber-400 to-amber-500 shadow-amber-200"
                        : "bg-gradient-to-t from-indigo-500 to-blue-500"
                    }`}
                  />
                  <span className={`absolute top-2 text-xs font-bold font-mono ${isHighest ? "text-amber-700 font-black" : "text-gray-800"}`}>
                    ₹{Math.round(pt.price)}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium mt-2">{pt.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
