import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../Context/authContext";
import { EventCard } from "../components/EventCard";
import EventModal from "../components/EventModal";

const HomePage = ({ onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const eventsRes = await axiosInstance.get("/events");
      const events = eventsRes.data.events || eventsRes.data;
      setEvents(events);

      if (user) {
        const rsvpRes = await axiosInstance.get("/events/rsvps/my");
        console.log(rsvpRes.data.rsvps);

        setRsvpedEvents(rsvpRes.data.rsvps || []);
      } else {
        setRsvpedEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setRsvpedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId, isRSVPed) => {
    try {
      if (isRSVPed) {
        await axiosInstance.delete(`/events/${eventId}/rsvp`);
        setRsvpedEvents(rsvpedEvents.filter((id) => id !== eventId));
      } else {
        await axiosInstance.post(`/events/${eventId}/rsvp`);
        setRsvpedEvents([...rsvpedEvents, eventId]);
      }
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || "RSVP failed");
    }
  };

  const handleCreateEvent = async (formData) => {
    try {
      await axiosInstance.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-xl sm:text-2xl text-gray-600">
          Loading events...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-600">
              Event Platform
            </h1>

            {user && (
              <>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {mobileMenuOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-3 lg:gap-4 items-center">
                  <span className="text-sm lg:text-base text-gray-700 truncate max-w-[150px] lg:max-w-none">
                    Welcome, {user.username}!
                  </span>

                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm lg:text-base whitespace-nowrap"
                  >
                    Create Event
                  </button>

                  <button
                    onClick={() => onNavigate("myEvents")}
                    className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm lg:text-base whitespace-nowrap"
                  >
                    My Events
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      onNavigate("login");
                    }}
                    className="bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm lg:text-base"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Dropdown */}
          {user && mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="text-sm text-gray-700 mb-3">
                Welcome, {user.username}!
              </div>

              <button
                onClick={() => {
                  setShowModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
              >
                Create Event
              </button>

              <button
                onClick={() => {
                  onNavigate("myEvents");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                My Events
              </button>

              <button
                onClick={() => {
                  logout();
                  onNavigate("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          All Events
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-lg sm:text-xl text-gray-600">
              No events available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRSVP={handleRSVP}
                isRSVPed={rsvpedEvents.includes(event._id)}
                showActions={false}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <EventModal
          onClose={() => setShowModal(false)}
          onSave={handleCreateEvent}
        />
      )}
    </div>
  );
};
export { HomePage };
