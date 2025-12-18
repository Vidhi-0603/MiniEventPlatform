import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axiosInstance from "../utils/axiosInstance";
import { EventCard } from "../components/EventCard";
import EventModal from "../components/EventModal";

const MyEventsPage = ({ onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await axiosInstance.get("/events/myEvents");
      setEvents(response.data.events || []);
    } catch (error) {
      console.error("Error fetching my events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await axiosInstance.delete(`/events/${eventId}`);
      fetchMyEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete event");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleUpdate = async (formData) => {
    try {
      await axiosInstance.put(`/events/${editingEvent._id}`, formData);
      setShowModal(false);
      setEditingEvent(null);
      fetchMyEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">
              Event Platform
            </h1>
            <div className="flex gap-4 items-center">
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <button
                onClick={() => onNavigate("home")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                All Events
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Events</h2>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              You haven't created any events yet.
            </p>
            <button
              onClick={() => onNavigate("home")}
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(null);
          }}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};
export { MyEventsPage };
