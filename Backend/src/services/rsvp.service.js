const mongoose = require("mongoose");
const eventModel = require("../models/Event.model");
const rsvpModel = require("../models/Rsvp.model");

const createRsvp = async (eventId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Increment attendeesCount ONLY if capacity allows
    const event = await eventModel.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: ["$attendeesCount", "$capacity"] },
      },
      { $inc: { attendeesCount: 1 } },
      { new: true, session }
    );

    if (!event) {
      throw new Error("Event is full or does not exist");
    }

    // Create RSVP (unique index prevents duplicates)
    await rsvpModel.create([{ user: userId, event: eventId }], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { message: "RSVP successful" };
  } catch (err) {
    // Rollback everything
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const deleteRsvp = async (eventId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Delete RSVP
    const rsvp = await rsvpModel.findOneAndDelete(
      { user: userId, event: eventId },
      { session }
    );

    if (!rsvp) {
      throw new Error("RSVP not found");
    }

    // 2️⃣ Decrement attendeesCount
    await eventModel.findByIdAndUpdate(
      eventId,
      { $inc: { attendeesCount: -1 } },
      { session }
    );

    // 3️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { message: "RSVP cancelled successfully" };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

module.exports = {
  createRsvp,
  deleteRsvp,
};