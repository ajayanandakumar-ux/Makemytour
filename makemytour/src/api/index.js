import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const login = async (email, password) => {
  try {
    const url = `${BACKEND_URL}/user/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    const res = await axios.post(url);
    return res.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    return res.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

export const getuserbyemail = async (email) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/user/email?email=${encodeURIComponent(email)}`);
    return res.data;
  } catch (error) {
    console.error("Get user by email failed:", error);
    throw error;
  }
};

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/edit?id=${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    return res.data;
  } catch (error) {
    console.error("Edit profile failed:", error);
    throw error;
  }
};

export const getflight = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight`);
    return res.data;
  } catch (error) {
    console.error("Get flights failed:", error);
    return [];
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/flight`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price: Number(price),
      availableSeats: Number(availableSeats),
    });
    return res.data;
  } catch (error) {
    console.error("Add flight failed:", error);
    throw error;
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${id}`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price: Number(price),
      availableSeats: Number(availableSeats),
    });
    return res.data;
  } catch (error) {
    console.error("Edit flight failed:", error);
    throw error;
  }
};

export const gethotel = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/hotel`);
    return res.data;
  } catch (error) {
    console.error("Get hotels failed:", error);
    return [];
  }
};

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/hotel`, {
      hotelName,
      location,
      pricePerNight: Number(pricePerNight),
      availableRooms: Number(availableRooms),
      amenities,
    });
    return res.data;
  } catch (error) {
    console.error("Add hotel failed:", error);
    throw error;
  }
};

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/hotel/${id}`, {
      hotelName,
      location,
      pricePerNight: Number(pricePerNight),
      availableRooms: Number(availableRooms),
      amenities,
    });
    return res.data;
  } catch (error) {
    console.error("Edit hotel failed:", error);
    throw error;
  }
};

export const handleflightbooking = async (userId, flightId, seats, price, selectedSeat = "12A") => {
  try {
    const url = `${BACKEND_URL}/booking/flight?userId=${userId}&flightId=${flightId}&seats=${seats}&price=${price}&selectedSeat=${selectedSeat}`;
    const res = await axios.post(url);
    return res.data;
  } catch (error) {
    console.error("Flight booking failed:", error);
    throw error;
  }
};

export const handlehotelbooking = async (userId, hotelId, rooms, price, selectedRoomType = "Deluxe Ocean View") => {
  try {
    const url = `${BACKEND_URL}/booking/hotel?userId=${userId}&hotelId=${hotelId}&rooms=${rooms}&price=${price}&selectedRoomType=${encodeURIComponent(selectedRoomType)}`;
    const res = await axios.post(url);
    return res.data;
  } catch (error) {
    console.error("Hotel booking failed:", error);
    throw error;
  }
};

export const getallusers = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/admin/users`);
    return res.data;
  } catch (error) {
    console.error("Get users failed:", error);
    return [];
  }
};

/* --- 6 ADVANCED PLATFORM FEATURE APIs --- */

// 1. Cancellation & Refund API
export const cancelBooking = async (userId, bookingId, reason) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/cancellation/cancel?userId=${userId}&bookingId=${bookingId}&reason=${encodeURIComponent(reason)}`);
    return res.data;
  } catch (error) {
    console.error("Cancellation failed:", error);
    throw error;
  }
};

// 2. Reviews & Ratings API
export const getReviews = async (entityType, entityId, sortBy = "newest") => {
  try {
    const res = await axios.get(`${BACKEND_URL}/reviews?entityType=${entityType}&entityId=${entityId}&sortBy=${sortBy}`);
    return res.data;
  } catch (error) {
    console.error("Get reviews failed:", error);
    return [];
  }
};

export const addReview = async (review) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews`, review);
    return res.data;
  } catch (error) {
    console.error("Add review failed:", error);
    throw error;
  }
};

export const addReply = async (reviewId, userId, userName, comment) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews/${reviewId}/reply?userId=${userId}&userName=${encodeURIComponent(userName)}&comment=${encodeURIComponent(comment)}`);
    return res.data;
  } catch (error) {
    console.error("Add reply failed:", error);
    throw error;
  }
};

export const markHelpful = async (reviewId) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews/${reviewId}/helpful`);
    return res.data;
  } catch (error) {
    console.error("Mark helpful failed:", error);
    throw error;
  }
};

export const flagReview = async (reviewId, reason) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews/${reviewId}/flag?reason=${encodeURIComponent(reason)}`);
    return res.data;
  } catch (error) {
    console.error("Flag review failed:", error);
    throw error;
  }
};

// 3. Flight Status API
export const getFlightStatus = async (flightId) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight-status/${flightId}`);
    return res.data;
  } catch (error) {
    console.error("Get flight status failed:", error);
    return null;
  }
};

export const getAllFlightStatuses = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight-status/all`);
    return res.data;
  } catch (error) {
    console.error("Get all flight statuses failed:", error);
    return [];
  }
};

// 4. Dynamic Pricing & Price Freeze API
export const getPriceHistory = async (entityType, entityId, basePrice = 5000) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/pricing/history?entityType=${entityType}&entityId=${entityId}&basePrice=${basePrice}`);
    return res.data;
  } catch (error) {
    console.error("Get price history failed:", error);
    return null;
  }
};

export const freezePrice = async (entityType, entityId, userId, price) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/pricing/freeze?entityType=${entityType}&entityId=${entityId}&userId=${userId}&price=${price}`);
    return res.data;
  } catch (error) {
    console.error("Freeze price failed:", error);
    throw error;
  }
};

// 5. Personalized Recommendations API
export const getRecommendations = async (userId = "guest") => {
  try {
    const res = await axios.get(`${BACKEND_URL}/recommendations/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Get recommendations failed:", error);
    return [];
  }
};

export const recordRecommendationFeedback = async (userId, recommendationId, entityType, helpful) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/recommendations/feedback?userId=${userId}&recommendationId=${recommendationId}&entityType=${entityType}&helpful=${helpful}`);
    return res.data;
  } catch (error) {
    console.error("Record recommendation feedback failed:", error);
    throw error;
  }
};

export const updateRefundStatus = async (userId, bookingId, status) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/refunds/${userId}/${bookingId}/status?status=${encodeURIComponent(status)}`);
    return res.data;
  } catch (error) {
    console.error("Update refund status failed:", error);
    throw error;
  }
};

export const getFlaggedReviews = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/admin/reviews/flagged`);
    return res.data;
  } catch (error) {
    console.error("Get flagged reviews failed:", error);
    return [];
  }
};

export const approveReview = async (reviewId) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/reviews/${reviewId}/approve`);
    return res.data;
  } catch (error) {
    console.error("Approve review failed:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const res = await axios.delete(`${BACKEND_URL}/admin/reviews/${reviewId}`);
    return res.data;
  } catch (error) {
    console.error("Delete review failed:", error);
    throw error;
  }
};

export const saveUserPreferences = async (userId, preferredSeat, preferredRoomType) => {
  try {
    const url = `${BACKEND_URL}/user/preferences?userId=${userId}&preferredSeat=${encodeURIComponent(preferredSeat || '')}&preferredRoomType=${encodeURIComponent(preferredRoomType || '')}`;
    const res = await axios.post(url);
    return res.data;
  } catch (error) {
    console.error("Save preferences failed:", error);
    throw error;
  }
};
