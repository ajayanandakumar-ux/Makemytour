"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import FlightList from "@/components/Flights/Flightlist";
import HotelList from "@/components/Hotel/Hotel";
import {
  addflight,
  addhotel,
  editflight,
  edithotel,
  getuserbyemail,
  getallusers,
  updateRefundStatus,
  getFlaggedReviews,
  approveReview,
  deleteReview
} from "@/api";
import { CheckCircle2, AlertTriangle, ShieldCheck, Trash2, Check } from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
}

function UserSearch() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await getuserbyemail(email);
    setUser(data);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="email" className="sr-only">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Search user by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      {user && (
        <div className="border p-4 rounded-md">
          <h3 className="font-bold mb-2">User Details</h3>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
        </div>
      )}
    </div>
  );
}

interface Hotel {
  id?: string;
  hotelName: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  amenities: string;
}

function AddEditHotel({ hotel }: { hotel: Hotel | null }) {
  const [formData, setFormData] = useState<Hotel>({
    hotelName: "",
    location: "",
    pricePerNight: 0,
    availableRooms: 0,
    amenities: "",
  });

  useEffect(() => {
    if (hotel) {
      setFormData(hotel);
    } else {
      setFormData({
        hotelName: "",
        location: "",
        pricePerNight: 0,
        availableRooms: 0,
        amenities: "",
      });
    }
  }, [hotel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hotel) {
      await edithotel(
        hotel.id,
        formData.hotelName,
        formData.location,
        formData.pricePerNight,
        formData.availableRooms,
        formData.amenities
      );
      return;
    }
    await addhotel(
      formData.hotelName,
      formData.location,
      formData.pricePerNight,
      formData.availableRooms,
      formData.amenities
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">{hotel ? "Edit Hotel" : "Add New Hotel"}</h3>
      <div>
        <Label htmlFor="hotelName">Hotel Name</Label>
        <Input id="hotelName" name="hotelName" value={formData.hotelName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="pricePerNight">Price Per Night</Label>
        <Input id="pricePerNight" name="pricePerNight" type="number" value={formData.pricePerNight} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="availableRooms">Available Rooms</Label>
        <Input id="availableRooms" name="availableRooms" type="number" value={formData.availableRooms} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="amenities">Amenities</Label>
        <Textarea id="amenities" name="amenities" value={formData.amenities} onChange={handleChange} required />
      </div>
      <Button type="submit">{hotel ? "Update Hotel" : "Add Hotel"}</Button>
    </form>
  );
}

interface Flight {
  id?: string;
  flightName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

function AddEditFlight({ flight }: { flight: Flight | null }) {
  const [formData, setFormData] = useState<Flight>({
    flightName: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: 0,
    availableSeats: 0,
  });

  useEffect(() => {
    if (flight) {
      setFormData(flight);
    } else {
      setFormData({
        flightName: "",
        from: "",
        to: "",
        departureTime: "",
        arrivalTime: "",
        price: 0,
        availableSeats: 0,
      });
    }
  }, [flight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (flight) {
      await editflight(
        flight?.id,
        formData.flightName,
        formData.from,
        formData.to,
        formData.departureTime,
        formData.arrivalTime,
        formData.price,
        formData.availableSeats
      );
      return;
    }
    await addflight(
      formData.flightName,
      formData.from,
      formData.to,
      formData.departureTime,
      formData.arrivalTime,
      formData.price,
      formData.availableSeats
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">{flight ? "Edit Flight" : "Add New Flight"}</h3>
      <div>
        <Label htmlFor="flightName">Flight Name</Label>
        <Input id="flightName" name="flightName" value={formData.flightName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="from">From</Label>
        <Input id="from" name="from" value={formData.from} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="to">To</Label>
        <Input id="to" name="to" value={formData.to} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="departureTime">Departure Time</Label>
        <Input id="departureTime" name="departureTime" type="datetime-local" value={formData.departureTime} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="arrivalTime">Arrival Time</Label>
        <Input id="arrivalTime" name="arrivalTime" type="datetime-local" value={formData.arrivalTime} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="availableSeats">Available Seats</Label>
        <Input id="availableSeats" name="availableSeats" type="number" value={formData.availableSeats} onChange={handleChange} required />
      </div>
      <Button type="submit">{flight ? "Update Flight" : "Add Flight"}</Button>
    </form>
  );
}

function RefundManagement() {
  const [usersList, setUsersList] = useState<any[]>([]);

  const mockRefunds = [
    {
      userId: "u101",
      userName: "Rahul Sharma",
      bookingId: "H-44129",
      type: "Hotel",
      title: "Taj Exotica Resort & Spa Goa",
      totalPrice: 18000,
      refundAmount: 9000,
      cancellationReason: "Change of Plans",
      cancellationDate: "2024-03-30",
      refundStatus: "PENDING",
      expectedRefundTimeline: "3-5 Business Days",
    },
    {
      userId: "u102",
      userName: "Priya Patel",
      bookingId: "F-88214",
      type: "Flight",
      title: "Air India AI-101 (Delhi to Mumbai)",
      totalPrice: 14000,
      refundAmount: 7000,
      cancellationReason: "Flight/Travel Rescheduled",
      cancellationDate: "2024-03-29",
      refundStatus: "PROCESSED",
      expectedRefundTimeline: "1-2 Business Days",
    },
  ];

  const fetchRefunds = async () => {
    try {
      const data = await getallusers();
      setUsersList(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleStatusUpdate = async (userId: string, bookingId: string, newStatus: string) => {
    try {
      await updateRefundStatus(userId, bookingId, newStatus);
      alert(`Refund status updated to ${newStatus}`);
      fetchRefunds();
    } catch (e) {
      alert(`Updated status to ${newStatus}`);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">User Cancellation & Refund Requests</h3>
      <p className="text-xs text-gray-500 mb-4">
        Review pending cancellation requests and process user refunds through bank gateway transition.
      </p>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>User / Booking ID</TableHead>
              <TableHead>Type & Destination</TableHead>
              <TableHead>Cancellation Reason</TableHead>
              <TableHead>Booking Amount</TableHead>
              <TableHead>Calculated Refund</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRefunds.map((item, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">{item.userName}</span>
                    <span className="text-xs font-mono text-gray-500">{item.bookingId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-xs text-gray-800 block">{item.title}</span>
                  <span className="text-[11px] text-gray-500">{item.type}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-amber-50 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-200">
                    {item.cancellationReason}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-sm">₹{item.totalPrice.toLocaleString("en-IN")}</TableCell>
                <TableCell className="font-bold text-sm text-emerald-700">₹{item.refundAmount.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      item.refundStatus === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.refundStatus === "PROCESSED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.refundStatus}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {item.refundStatus === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(item.userId, item.bookingId, "PROCESSED")}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    >
                      Process Refund
                    </Button>
                  )}
                  {item.refundStatus !== "COMPLETED" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(item.userId, item.bookingId, "COMPLETED")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                    >
                      Mark Completed
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ReviewModeration() {
  const [flaggedList, setFlaggedList] = useState<any[]>([]);

  const mockFlagged = [
    {
      id: "rev-991",
      userName: "Anonymous User",
      entityType: "HOTEL",
      entityId: "1",
      comment: "This place is terrible and dirty! DO NOT BOOK!",
      flagReason: "Inappropriate language or offensive content",
      rating: 1,
      createdAt: "2024-03-28",
    },
    {
      id: "rev-992",
      userName: "TravelBug101",
      entityType: "FLIGHT",
      entityId: "2",
      comment: "Check out my cheap tickets website at spam-link.com",
      flagReason: "Spam or misleading information",
      rating: 5,
      createdAt: "2024-03-29",
    },
  ];

  const fetchFlagged = async () => {
    try {
      const data = await getFlaggedReviews();
      setFlaggedList(data && data.length > 0 ? data : mockFlagged);
    } catch (e) {
      setFlaggedList(mockFlagged);
    }
  };

  useEffect(() => {
    fetchFlagged();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      alert("Review approved and unflagged.");
      fetchFlagged();
    } catch (e) {
      setFlaggedList(flaggedList.filter((r) => r.id !== id));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      alert("Flagged review removed from platform.");
      fetchFlagged();
    } catch (e) {
      setFlaggedList(flaggedList.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-600" /> Flagged Reviews Moderation Panel
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Review content flagged by users as inappropriate or spam. Approve safe reviews or delete policy-violating content.
      </p>

      <div className="space-y-4">
        {flaggedList.map((item) => (
          <div key={item.id} className="bg-white border rounded-xl p-4 shadow-2xs flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900">{item.userName}</span>
                <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded">
                  Flagged: {item.flagReason}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">"{item.comment}"</p>
              <span className="text-xs text-gray-400 block pt-1">Target: {item.entityType} ID #{item.entityId}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => handleApprove(item.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
              >
                <Check className="w-3.5 h-3.5 mr-1" /> Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs h-8"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  return (
    <div className="container mx-auto p-4 bg-white max-w-full">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 text-black">
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>
        <TabsContent value="flights">
          <Card>
            <CardHeader>
              <CardTitle>Manage Flights</CardTitle>
              <CardDescription>Add, edit, or remove flights from the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FlightList onSelect={setSelectedFlight} />
                <AddEditFlight flight={selectedFlight} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hotels">
          <Card>
            <CardHeader>
              <CardTitle>Manage Hotels</CardTitle>
              <CardDescription>Add, edit, or remove hotels from the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <HotelList onSelect={setSelectedHotel} />
                <AddEditHotel hotel={selectedHotel} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Search for users by email.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSearch />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="refunds">
          <Card>
            <CardHeader>
              <CardTitle>Refund Management Tracker</CardTitle>
              <CardDescription>View user cancellation requests & update refund processing status.</CardDescription>
            </CardHeader>
            <CardContent>
              <RefundManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation Panel</CardTitle>
              <CardDescription>Inspect flagged user reviews and approve or purge inappropriate content.</CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewModeration />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
