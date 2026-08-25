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

export const handleflightbooking = async (userId, flightId, seats, price) => {
  try {
    const url = `${BACKEND_URL}/booking/flight?userId=${userId}&flightId=${flightId}&seats=${seats}&price=${price}`;
    const res = await axios.post(url);
    return res.data;
  } catch (error) {
    console.error("Flight booking failed:", error);
    throw error;
  }
};

export const handlehotelbooking = async (userId, hotelId, rooms, price) => {
  try {
    const url = `${BACKEND_URL}/booking/hotel?userId=${userId}&hotelId=${hotelId}&rooms=${rooms}&price=${price}`;
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
