package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class Users {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String phoneNumber;
    private String preferredSeat;
    private String preferredRoomType;
    private List<Booking> bookings = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPreferredSeat() {
        return preferredSeat;
    }

    public void setPreferredSeat(String preferredSeat) {
        this.preferredSeat = preferredSeat;
    }

    public String getPreferredRoomType() {
        return preferredRoomType;
    }

    public void setPreferredRoomType(String preferredRoomType) {
        this.preferredRoomType = preferredRoomType;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public static class Booking {
        private String bookingId;
        private String itemReferenceId; // Flight or Hotel ID
        private String type; // "Flight" or "Hotel"
        private String title; // Flight Name or Hotel Name
        private String date;
        private int quantity;
        private double totalPrice;

        // Cancellation & Refund tracking
        private String status = "CONFIRMED"; // CONFIRMED, CANCELLED
        private String cancellationReason;
        private String cancellationDate;
        private double refundAmount;
        private String refundStatus = "NONE"; // NONE, PENDING, PROCESSED, COMPLETED
        private String expectedRefundTimeline;

        // Seat & Room selection
        private String selectedSeat;
        private String selectedRoomType;

        public String getBookingId() {
            return bookingId;
        }

        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }

        public String getItemReferenceId() {
            return itemReferenceId;
        }

        public void setItemReferenceId(String itemReferenceId) {
            this.itemReferenceId = itemReferenceId;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public double getTotalPrice() {
            return totalPrice;
        }

        public void setTotalPrice(double totalPrice) {
            this.totalPrice = totalPrice;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getCancellationReason() {
            return cancellationReason;
        }

        public void setCancellationReason(String cancellationReason) {
            this.cancellationReason = cancellationReason;
        }

        public String getCancellationDate() {
            return cancellationDate;
        }

        public void setCancellationDate(String cancellationDate) {
            this.cancellationDate = cancellationDate;
        }

        public double getRefundAmount() {
            return refundAmount;
        }

        public void setRefundAmount(double refundAmount) {
            this.refundAmount = refundAmount;
        }

        public String getRefundStatus() {
            return refundStatus;
        }

        public void setRefundStatus(String refundStatus) {
            this.refundStatus = refundStatus;
        }

        public String getExpectedRefundTimeline() {
            return expectedRefundTimeline;
        }

        public void setExpectedRefundTimeline(String expectedRefundTimeline) {
            this.expectedRefundTimeline = expectedRefundTimeline;
        }

        public String getSelectedSeat() {
            return selectedSeat;
        }

        public void setSelectedSeat(String selectedSeat) {
            this.selectedSeat = selectedSeat;
        }

        public String getSelectedRoomType() {
            return selectedRoomType;
        }

        public void setSelectedRoomType(String selectedRoomType) {
            this.selectedRoomType = selectedRoomType;
        }
    }
}
