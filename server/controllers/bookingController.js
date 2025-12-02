// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import mongoose from "mongoose";

/**
 * POST /api/booking/create
 * Body: { showId, selectedSeats: ["A1","A2"], idempotencyKey }
 * Auth: required (req.auth().userId)
 *
 * Behavior:
 *  - If same idempotencyKey was used before -> return existing booking (idempotent)
 *  - Try to atomically reserve ALL requested seats using one update query.
 *  - If update matchedCount === 0 -> some seat already taken -> respond 409
 *  - Otherwise create Booking doc (status PENDING) and return booking info
 *
 * Notes:
 *  - This implementation uses atomic update conditions with $exists:false checks.
 *  - For extremely high concurrency or multi-instance scaling, consider using transactions or Redis locks.
 */
export const createBookingAtomic = async (req, res) => {
  try {
    const { userId } = req.auth(); // Clerk style in your codebase
    const { showId, selectedSeats, idempotencyKey } = req.body;

    // Basic validation
    if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid payload" });
    }

    // Idempotency: if a booking already exists with this key for this user, return it
    if (idempotencyKey) {
      const existing = await Booking.findOne({ idempotencyKey, user: userId });
      if (existing) {
        return res.status(200).json({ success: true, booking: existing, message: "Idempotent replay - returning existing booking" });
      }
    }

    // Fetch show for price calculation and existence check
    const show = await Show.findById(showId).lean();
    if (!show) return res.status(404).json({ success: false, message: "Show not found" });

    // Calculate amount
    const amount = (show.showPrice || 0) * selectedSeats.length;

    // Build the query conditions to ensure none of the seats exist already
    const seatExistConditions = selectedSeats.reduce((acc, seat) => {
      acc[`occupiedSeats.${seat}`] = { $exists: false };
      return acc;
    }, { _id: mongoose.Types.ObjectId(showId) });

    // Build the $set object to reserve seats (store userId or temporary booking id)
    const seatSet = selectedSeats.reduce((acc, seat) => {
      acc[`occupiedSeats.${seat}`] = userId; // you can store bookingId later if preferred
      return acc;
    }, {});

    // Atomic update: set all seats only if none of them existed
    const updateResult = await Show.updateOne(
      seatExistConditions,
      { $set: seatSet }
    );

    // If no docs matched, at least one seat was already occupied
    if (updateResult.matchedCount === 0) {
      return res.status(409).json({ success: false, message: "One or more selected seats are no longer available" });
    }

    // Seats reserved successfully in show document. Now create booking (PENDING)
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount,
      bookedSeats: selectedSeats,
      status: "PENDING",          // PENDING until payment confirmed
      idempotencyKey: idempotencyKey || null,
      paymentIntentId: null,      // will be set after creating PaymentIntent if you use Stripe
      createdAt: new Date()
    });

    // Optionally: if you want payment-client secret, create PaymentIntent here and attach id.
    // For now return booking info and let frontend create payment with booking reference.
    return res.status(201).json({ success: true, booking });

  } catch (err) {
    console.error("createBookingAtomic error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
