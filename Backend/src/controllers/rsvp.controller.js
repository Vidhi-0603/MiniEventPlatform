const { deleteRsvp, createRsvp } = require("../services/rsvp.service");

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

module.exports = { create_Rsvp, delete_Rsvp };