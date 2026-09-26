"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getRegistrationsForStudent } from "@/data/registrations";
import { getEventById } from "@/data/events";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

export default function RegistrationsPage() {
  const { currentUser } = useAuth();

  if (currentUser.role !== "student") {
    return (
      <section className="shell" style={{ padding: "56px 0" }}>
        <EmptyState
          title="This page is for students"
          description="Switch to a student account from the top-right menu to see registered events."
        />
      </section>
    );
  }

  const [myRegistrations, setMyRegistrations] = useState(
    getRegistrationsForStudent(currentUser.id),
  );

  const handleCancelRegistration = async (id: string) => {
    const response = await fetch(`/api/registrations/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to cancel registration");
      return;
    }

    setMyRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === id
          ? {
              ...reg,
              status: "cancelled",
            }
          : reg,
      ),
    );
  };

  const upcomingRegistrations = myRegistrations.filter((reg) => {
    const event = getEventById(reg.eventId);

    return event && new Date(event.date) >= new Date();
  });

  const pastRegistrations = myRegistrations.filter((reg) => {
    const event = getEventById(reg.eventId);

    return event && new Date(event.date) < new Date();
  });

  const renderRegistrations = (registrations: any[]) => {
    if (registrations.length === 0) {
      return <p style={{ color: "var(--ink-soft)" }}>No registrations here.</p>;
    }

    return (
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {registrations.map((reg) => {
          const event = getEventById(reg.eventId);

          if (!event) return null;

          return (
            <li
              key={reg.id}
              className="card-surface"
              style={{
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
                    textDecoration: "none",
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
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}

                  {" · "}

                  {event.venue}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <StatusBadge
                  status={reg.status === "cancelled" ? "cancelled" : "open"}
                />

                <button
                  className="btn btn-secondary"
                  disabled={reg.status === "cancelled"}
                  onClick={() => handleCancelRegistration(reg.id)}
                >
                  {reg.status === "cancelled" ? "Cancelled" : "Cancel"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section
      className="shell"
      style={{
        padding: "40px 0 64px",
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow-tag">signed up as {currentUser.name}</span>

        <h1
          style={{
            fontSize: 30,
            marginTop: 10,
          }}
        >
          My registrations
        </h1>
      </div>

      {myRegistrations.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          description="Once you register for an event, it'll show up here."
          action={
            <Link href="/events" className="btn btn-primary">
              Browse events
            </Link>
          }
        />
      ) : (
        <>
          <h2 style={{ marginBottom: 15 }}>Upcoming Events</h2>

          {renderRegistrations(upcomingRegistrations)}

          <h2
            style={{
              marginTop: 40,
              marginBottom: 15,
            }}
          >
            Past Events
          </h2>

          {renderRegistrations(pastRegistrations)}
        </>
      )}
    </section>
  );
}
