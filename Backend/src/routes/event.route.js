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

router.post("/", isAuthenticated, createEvent);
router.get("/", getAllEvents);
router.get("/mine", isAuthenticated, getMyEvents);
router.put("/:id", isAuthenticated, updateEvent);
router.delete("/:id", isAuthenticated, deleteEvent);

module.exports = router;
