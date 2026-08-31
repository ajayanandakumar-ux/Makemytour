import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Edit2,
  MapPin,
  Calendar,
  CreditCard,
  X,
  Check,
  LogOut,
  Plane,
  Building2,
  AlertCircle,
  RefreshCw,
  Armchair,
  Building,
  CheckCircle,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUser, setUser } from "@/store";
import { editprofile, cancelBooking } from "@/api";

const index = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  // Default demo bookings if user has none
  const defaultBookings = [
    {
      bookingId: "F-90812",
      type: "Flight",
      title: "Delhi to Mumbai (IndiGo 6E-204)",
      date: new Date().toISOString().split("T")[0],
      quantity: 2,
      totalPrice: 12500,
      status: "CONFIRMED",
      selectedSeat: user?.preferredSeat || "12A",
    },
    {
      bookingId: "H-44129",
      type: "Hotel",
      title: "Taj Exotica Resort & Spa Goa",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      quantity: 1,
      totalPrice: 18000,
      status: "CANCELLED",
      cancellationReason: "Change of Plans",
      cancellationDate: new Date().toISOString().split("T")[0],
      refundAmount: 9000,
      refundStatus: "PENDING",
      expectedRefundTimeline: "3-5 Business Days",
      selectedRoomType: user?.preferredRoomType || "Deluxe Ocean View",
    },
  ];

  const userBookings = user?.bookings && user.bookings.length > 0 ? user.bookings : defaultBookings;

  // Cancellation Modal state
  const [cancelModalBooking, setCancelModalBooking] = useState<any | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>("Change of Plans");
  const [cancellationLoading, setCancellationLoading] = useState(false);

  const [editForm, setEditForm] = useState({ ...userData });
  const handleSave = async () => {
    try {
      const data = await editprofile(
        user?.id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber
      );
      dispatch(setUser(data));
      setIsEditing(false);
    } catch (error) {
      setUserData(editForm);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleEditFormChange = (field: any, value: any) => {
    setUserData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleConfirmCancellation = async () => {
    if (!cancelModalBooking) return;
    setCancellationLoading(true);
    try {
      if (user?.id) {
        const updatedBooking = await cancelBooking(user.id, cancelModalBooking.bookingId, cancellationReason);
        // update redux state with cancelled booking
        const updatedUser = {
          ...user,
          bookings: user.bookings.map((b: any) =>
            b.bookingId === cancelModalBooking.bookingId ? updatedBooking : b
          ),
        };
        dispatch(setUser(updatedUser));
      } else {
        // Fallback local update
        cancelModalBooking.status = "CANCELLED";
        cancelModalBooking.cancellationReason = cancellationReason;
        cancelModalBooking.cancellationDate = new Date().toISOString().split("T")[0];
        cancelModalBooking.refundAmount = cancelModalBooking.totalPrice * 0.5;
        cancelModalBooking.refundStatus = "PENDING";
        cancelModalBooking.expectedRefundTimeline = "3-5 Business Days";
      }
      setCancelModalBooking(null);
    } catch (e) {
      alert("Failed to process cancellation.");
    } finally {
      setCancellationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile & Saved Preferences Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-red-600 text-sm font-semibold flex items-center space-x-1 hover:text-red-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => handleEditFormChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border text-sm rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => handleEditFormChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border text-sm rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleEditFormChange("email", e.target.value)}
                      className="w-full px-3 py-2 border text-sm rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={userData.phoneNumber}
                      onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)}
                      className="w-full px-3 py-2 border text-sm rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-red-600 text-white text-xs py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-100 text-gray-700 text-xs py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                      {user?.firstName ? user.firstName[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">
                        {user?.firstName || "Guest"} {user?.lastName || "User"}
                      </p>
                      <span className="text-xs bg-red-50 text-red-700 font-semibold px-2 py-0.5 rounded">Verified Member</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 pt-2 border-t">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p>{user?.email || "user@makemytrip.com"}</p>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p>{user?.phoneNumber || "+91 9876543210"}</p>
                  </div>
                  <button
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-sm text-red-600 font-semibold hover:text-red-700 py-2 border border-red-100 rounded-lg hover:bg-red-50 transition"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Saved Seat & Room Preferences Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Armchair className="w-5 h-5 text-blue-600" /> Saved Travel Preferences
              </h3>
              <div className="space-y-3 text-xs">
                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-gray-500 block text-[11px]">Flight Seat</span>
                      <span className="font-bold text-gray-900">{user?.preferredSeat || "12A (Window)"}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">Active Default</span>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-gray-500 block text-[11px]">Hotel Room Type</span>
                      <span className="font-bold text-gray-900">{user?.preferredRoomType || "Deluxe Ocean View"}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">Active Default</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings & Cancellation Tracker Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Bookings & Cancellations</h2>
                <span className="text-xs text-gray-500 font-medium">Manage reservations & refund status</span>
              </div>

              <div className="space-y-6">
                {userBookings.map((booking: any, index: number) => {
                  const isCancelled = booking?.status === "CANCELLED";
                  const refundStatus = booking?.refundStatus || "PENDING";

                  return (
                    <div
                      key={index}
                      className={`border rounded-2xl p-5 transition-all ${
                        isCancelled ? "border-amber-200 bg-amber-50/20" : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {booking?.type === "Flight" ? (
                            <div className="bg-blue-100 p-2.5 rounded-xl">
                              <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                          ) : (
                            <div className="bg-emerald-100 p-2.5 rounded-xl">
                              <Building2 className="w-6 h-6 text-emerald-600" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base text-gray-900">{booking?.title || `${booking?.type} Booking`}</h3>
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                  isCancelled
                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                }`}
                              >
                                {isCancelled ? "CANCELLED" : "CONFIRMED"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Booking ID: <span className="font-mono font-semibold">{booking?.bookingId}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            ₹ {booking?.totalPrice?.toLocaleString("en-IN")}
                          </p>
                          {!isCancelled && (
                            <button
                              onClick={() => setCancelModalBooking(booking)}
                              className="mt-1 text-xs text-red-600 font-semibold hover:text-red-800 underline transition"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(booking?.date)}</span>
                        </div>
                        {booking?.selectedSeat && (
                          <div className="flex items-center space-x-1 text-blue-700 font-semibold">
                            <Armchair className="w-4 h-4 text-blue-600" />
                            <span>Seat: {booking.selectedSeat}</span>
                          </div>
                        )}
                        {booking?.selectedRoomType && (
                          <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
                            <Building className="w-4 h-4 text-emerald-600" />
                            <span>Room: {booking.selectedRoomType}</span>
                          </div>
                        )}
                      </div>

                      {/* Refund Status Tracker Stepper for Cancelled Bookings */}
                      {isCancelled && (
                        <div className="mt-4 pt-4 border-t border-amber-200/60 bg-white rounded-xl p-4 border shadow-2xs">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                              <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" /> Refund Status Tracker & Timeline
                            </h4>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              Refund Amount: ₹{(booking.refundAmount || booking.totalPrice * 0.5).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 mb-4">
                            Reason: <span className="font-medium text-gray-800">{booking.cancellationReason || "Change of Plans"}</span> | Timeline: <span className="font-bold text-blue-600">{booking.expectedRefundTimeline || "3-5 Business Days"}</span>
                          </p>

                          {/* Stepper Steps */}
                          <div className="grid grid-cols-3 gap-2 relative">
                            <div className={`p-2.5 rounded-lg border text-center text-xs font-semibold ${
                              refundStatus === "PENDING" || refundStatus === "PROCESSED" || refundStatus === "COMPLETED"
                                ? "bg-blue-50 border-blue-300 text-blue-800"
                                : "bg-gray-50 border-gray-200 text-gray-400"
                            }`}>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> 1. Request Received
                              </div>
                              <span className="text-[10px] font-normal block text-blue-600">Pending Admin</span>
                            </div>

                            <div className={`p-2.5 rounded-lg border text-center text-xs font-semibold ${
                              refundStatus === "PROCESSED" || refundStatus === "COMPLETED"
                                ? "bg-blue-50 border-blue-300 text-blue-800"
                                : "bg-gray-50 border-gray-200 text-gray-400"
                            }`}>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                {refundStatus === "PROCESSED" || refundStatus === "COMPLETED" ? (
                                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                )}
                                2. Refund Processed
                              </div>
                              <span className="text-[10px] font-normal block">Bank Gateway</span>
                            </div>

                            <div className={`p-2.5 rounded-lg border text-center text-xs font-semibold ${
                              refundStatus === "COMPLETED"
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                : "bg-gray-50 border-gray-200 text-gray-400"
                            }`}>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                {refundStatus === "COMPLETED" ? (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                )}
                                3. Refund Completed
                              </div>
                              <span className="text-[10px] font-normal block">Credited to Account</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Dialog Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" /> Cancel Booking Reservation
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to cancel booking <strong className="text-gray-900">{cancelModalBooking.bookingId}</strong>? Refunds are automatically calculated based on system policy.
            </p>

            {/* Refund Policy Calculation Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 mb-5 text-xs text-blue-900">
              <div className="flex justify-between items-center mb-1">
                <span>Original Booking Amount:</span>
                <span className="font-bold">₹{cancelModalBooking.totalPrice?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-sm text-emerald-700 pt-2 border-t border-blue-200">
                <span>Estimated Policy Refund (50%):</span>
                <span>₹{(cancelModalBooking.totalPrice * 0.5).toLocaleString("en-IN")}</span>
              </div>
              <span className="text-[10px] text-blue-600 mt-1 block">Expected processing timeline: 3-5 Business Days</span>
            </div>

            {/* Mandatory Reason Dropdown */}
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Select Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <select
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full border rounded-xl p-3 text-sm mb-6 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              <option value="Change of Plans">Change of Plans</option>
              <option value="Flight/Travel Rescheduled">Flight/Travel Rescheduled</option>
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Found Better Option">Found Better Option</option>
              <option value="Personal Reasons">Personal Reasons</option>
            </select>

            <div className="flex gap-3">
              <button
                disabled={cancellationLoading}
                onClick={handleConfirmCancellation}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm transition shadow"
              >
                {cancellationLoading ? "Processing..." : "Confirm Cancellation"}
              </button>
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
