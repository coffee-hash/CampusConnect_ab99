"use client";

import { useMemo, useState } from "react";
import {
  events,
  EventCategory,
  searchEventsByName,
  filterEventsByCategory,
} from "@/data/events";
import EventCard from "@/components/EventCard";

const CATEGORIES: (EventCategory | "All")[] = [
  "All",
  "Tech",
  "Cultural",
  "Sports",
  "Workshop",
  "Career",
  "Music",
];

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<EventCategory | "All">("All");

  const filteredEvents = useMemo(() => {
    let result = events;

    // First filter by category
    if (category !== "All") {
      result = filterEventsByCategory(result, category);
    }

    // Then apply search on the filtered result
    if (query.trim() !== "") {
      result = searchEventsByName(result, query);
    }

    return result;
  }, [query, category]);

  return (
    <section className="shell" style={{ padding: "40px 0 64px" }}>
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow-tag">the board</span>

        <h1 style={{ fontSize: 30, marginTop: 10 }}>
          All events
        </h1>

        <p style={{ marginTop: 8 }}>
          Everything posted by clubs and departments this semester.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <input
          type="search"
          placeholder="Search events by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: "1 1 240px",
            padding: "10px 14px",
            border: "1.5px solid var(--line)",
            borderRadius: "var(--radius)",
            fontSize: 14.5,
            background: "var(--paper-raised)",
          }}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as EventCategory | "All")
          }
          style={{
            padding: "10px 14px",
            border: "1.5px solid var(--line)",
            borderRadius: "var(--radius)",
            fontSize: 14.5,
            background: "var(--paper-raised)",
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))
        )}
      </div>
    </section>
  );
}