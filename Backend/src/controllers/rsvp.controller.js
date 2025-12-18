const { deleteRsvp, createRsvp, getRsvps } = require("../services/rsvp.service");

const create_Rsvp = async (req, res) => {
  try {
    const result = await createRsvp(req.params.id, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const delete_Rsvp = async (req, res) => {
  try {
    const result = await deleteRsvp(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getMyRsvps = async (req, res) => {
  try {
    const rsvps = await getRsvps(req.user.id);
    res.status(200).json({ rsvps });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { create_Rsvp, delete_Rsvp, getMyRsvps };