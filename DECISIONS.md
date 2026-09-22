# Architecture & Product Decisions

## DP1 — Rejection Policy

### Decision
When a client proposal is rejected, the client receives a transparent rejection reason and alternative creator suggestions.

### Why
This makes the rejection process transparent instead of leaving the client without useful feedback. Suggesting alternatives also helps the client continue their search without starting over.

---

## DP2 — Double Booking Policy

### Decision
The application uses a configurable soft queue/concurrency guard to manage creator booking availability and workload limits.

### Why
This helps prevent conflicting bookings while still allowing the system to handle multiple booking requests. The approach keeps creator availability and workload constraints visible to the booking flow.

---

## DP3 — Discovery Algorithm

### Decision
The marketplace supports multiple discovery options including Newest, Rating, Price, and an algorithmic Multi-factor Discovery score.

### Why
Different clients may prioritize different factors when selecting a creator. Providing multiple sorting options together with a multi-factor score gives clients more flexibility when discovering suitable services.