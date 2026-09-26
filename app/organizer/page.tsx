"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { events } from "@/data/events";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";

export default function OrganizerPage() {
  const { currentUser } = useAuth();

  const [myEvents, setMyEvents] = useState(
    events.filter((e) => e.organizerId === currentUser.id),
  );

  const [showForm, setShowForm] = useState(false);

  const [editingEvent, setEditingEvent] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",

    description: "",

    category: "Tech",

    date: "",

    venue: "",

    capacity: 0,
  });

  if (currentUser.role !== "organizer") {
    return (
      <section className="shell" style={{ padding: "56px 0" }}>
        <EmptyState
          title="This page is for organizers"
          description="Switch to an organizer account from the top-right menu to manage events."
        />
      </section>
    );
  }

  // OPEN CREATE FORM

  const openCreateForm = () => {
    setEditingEvent(null);

    setFormData({
      name: "",

      description: "",

      category: "Tech",

      date: "",

      venue: "",

      capacity: 0,
    });

    setShowForm(true);
  };

  // OPEN EDIT FORM

  const openEditForm = (event: any) => {
    setEditingEvent(event);

    setFormData({
      name: event.name,

      description: event.description,

      category: event.category,

      date: event.date.split("T")[0],

      venue: event.venue,

      capacity: event.capacity,
    });

    setShowForm(true);
  };

  // CREATE OR UPDATE EVENT

  const handleSaveEvent = async () => {
    try {
      if (editingEvent) {
        const response = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        });

        const updatedEvent = await response.json();

        setMyEvents((prev) =>
          prev.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event,
          ),
        );
      } else {
        const response = await fetch("/api/events", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,

            organizerId: currentUser.id,

            seatsAvailable: formData.capacity,
          }),
        });

        const newEvent = await response.json();

        setMyEvents((prev) => [...prev, newEvent]);
      }

      setShowForm(false);

      setEditingEvent(null);

      setFormData({
        name: "",

        description: "",

        category: "Tech",

        date: "",

        venue: "",

        capacity: 0,
      });
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  // CANCEL EVENT

  const handleCancelEvent = async (id: string) => {
    const response = await fetch(
      `/api/events/${id}`,

      {
        method: "DELETE",
      },
    );

    const cancelledEvent = await response.json();

    setMyEvents((prev) =>
      prev.map((event) => (event.id === id ? cancelledEvent : event)),
    );
  };

  return (
    <section className="shell" style={{ padding: "40px 0 64px" }}>
      <div
        style={{
          marginBottom: 28,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-end",

          flexWrap: "wrap",

          gap: 16,
        }}
      >
        <div>
          <span className="eyebrow-tag">organizer console</span>

          <h1 style={{ fontSize: 30, marginTop: 10 }}>Manage your events</h1>

          <p style={{ marginTop: 8 }}>Create, edit and cancel your events.</p>
        </div>

        <button className="btn btn-primary" onClick={openCreateForm}>
          + New event
        </button>
      </div>

      {showForm && (
        <div
          className="card-surface"
          style={{
            padding: 20,

            marginBottom: 20,

            display: "flex",

            flexDirection: "column",

            gap: 12,
          }}
        >
          <h3>{editingEvent ? "Edit Event" : "Create Event"}</h3>

          <input
            placeholder="Event name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,

                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,

                description: e.target.value,
              })
            }
          />

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,

                category: e.target.value,
              })
            }
          >
            <option>Tech</option>

            <option>Cultural</option>

            <option>Sports</option>

            <option>Workshop</option>

            <option>Career</option>

            <option>Music</option>
          </select>

          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({
                ...formData,

                date: e.target.value,
              })
            }
          />

          <input
            placeholder="Venue"
            value={formData.venue}
            onChange={(e) =>
              setFormData({
                ...formData,

                venue: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({
                ...formData,

                capacity: Number(e.target.value),
              })
            }
          />

          <button className="btn btn-primary" onClick={handleSaveEvent}>
            {editingEvent ? "Save Changes" : "Create Event"}
          </button>
        </div>
      )}

      {myEvents.length === 0 ? (
        <EmptyState
          title="No events posted yet"
          description="Once you create an event, it'll show up here."
        />
      ) : (
        <ul
          style={{
            display: "flex",

            flexDirection: "column",

            gap: 12,
          }}
        >
          {myEvents.map((event) => {
            const status = event.cancelled
              ? "cancelled"
              : event.seatsAvailable <= 0
                ? "full"
                : "open";

            return (
              <li
                key={event.id}
                className="card-surface"
                style={{
                  padding: "18px 20px",

                  display: "flex",

                  justifyContent: "space-between",

                  alignItems: "center",

                  gap: 16,

                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Link
                    href={`/events/${event.id}`}
                    style={{
                      fontFamily: "var(--font-display)",

                      fontWeight: 600,

                      fontSize: 17,
                    }}
                  >
                    {event.name}
                  </Link>

                  <div
                    style={{
                      fontSize: 13.5,

                      color: "var(--ink-soft)",

                      marginTop: 4,
                    }}
                  >
                    {event.venue}
                    {" · "}
                    {event.seatsAvailable}/{event.capacity}
                    {" seats"}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: 12,
                  }}
                >
                  <StatusBadge status={status} />

                  <button
                    className="btn btn-secondary"
                    onClick={() => openEditForm(event)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => handleCancelEvent(event.id)}
                    disabled={event.cancelled}
                  >
                    {event.cancelled ? "Cancelled" : "Cancel"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
