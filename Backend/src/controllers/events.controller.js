const { create_Event, get_All_Events, get_My_Events, update_Event,delete_Event} = require("../services/event.service");


// Create event
const createEvent = async (req, res) => {
  try {
    const event = await create_Event(req.body, req.user.id);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//  Get all upcoming events
const getAllEvents = async (req, res) => {
  try {
    const events = await get_All_Events();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get events created by logged-in user
const getMyEvents = async (req, res) => {
  try {
    const events = await get_My_Events(req.user.id);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update event
const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await update_Event(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json(updatedEvent);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    await delete_Event(req.params.id, req.user.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  getMyEvents,
  deleteEvent,
};
