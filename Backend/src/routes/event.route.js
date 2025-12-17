// routes/events.routes.js
const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getMyEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/events.controller");
const isAuthenticated = require("../middlewares/auth.middleware");
const { delete_Rsvp, create_Rsvp } = require("../controllers/rsvp.controller");

router.post("/", isAuthenticated, createEvent);
router.get("/", getAllEvents);
router.get("/myEvents", isAuthenticated, getMyEvents);
router.put("/:id", isAuthenticated, updateEvent);
router.delete("/:id", isAuthenticated, deleteEvent);
router.post("/:id/rsvp", isAuthenticated, create_Rsvp);
router.delete("/:id/rsvp", isAuthenticated, delete_Rsvp);

module.exports = router;