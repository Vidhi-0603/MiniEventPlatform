const eventModel = require("../models/Event.model");

const create_Event = async (eventData, userId) => {
  return eventModel.create({
    ...eventData,
    createdBy: userId,
  });
};

/**
 * Get all upcoming events
 */
const get_All_Events = async () => {
  return eventModel
    .find({
      dateTime: { $gte: new Date() },
    })
    .sort({ dateTime: 1 });
};

/**
 * Get events created by logged-in user
 */
const get_My_Events = async (userId) => {
  return eventModel.find({ createdBy: userId }).sort({ createdAt: -1 });
};

/**
 * Update event (owner only, safe fields)
 */
const update_Event = async (eventId, userId, updateData) => {
  const event = await eventModel.findOne({
    _id: eventId,
    createdBy: userId,
  });

  if (!event) {
    throw new Error("Event not found or not authorized");
  }

  const allowedFields = [
    "title",
    "description",
    "dateTime",
    "location",
    "capacity",
    "imageUrl",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      event[field] = updateData[field];
    }
  });

  return event.save();
};

/**
 * Delete event (owner only)
 */
const delete_Event = async (eventId, userId) => {
  const event = await eventModel.findOneAndDelete({
    _id: eventId,
    createdBy: userId,
  });

  if (!event) {
    throw new Error("Event not found or not authorized");
  }

  return event;
};

module.exports = {
  create_Event,
  get_All_Events,
  get_My_Events,
  update_Event,
  delete_Event,
};