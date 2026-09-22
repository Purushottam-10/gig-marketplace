# Creator Gig Marketplace

**Hackathon ID:** AZIS-SRXSSS  
**Team:** HARIDWAR TEAM 21


A fully functional dynamic web platform where creators monetize their skills and clients book them.

## Features Included
1. **Post a Gig**: Form to list services with title, category, delivery time, price, tags, and description.
2. **Browse & Search**: Filter by keywords, categories, and dynamic ranking strategies.
3. **Book a Gig**: Client order form with custom requirements and target deadlines.
4. **Creator Dashboard**: Manage incoming requests, accept or decline proposals, view income metrics.
5. **My Bookings (Client)**: Track statuses (`Pending`, `Accepted`, `Declined`) with full transparent feedback.
6. **Role Switching**: Instant toggling between Creator and Client personas.
7. **Architectural Decision Points**:
   - **DP1 (Rejection)**: Client receives transparent feedback reasons plus 1-click alternative creator suggestions.
   - **DP2 (Double Booking Policy)**: Configurable soft queue / concurrency guard to balance booking availability and workload limits.
   - **DP3 (Discovery Algorithm)**: Support for Newest, Rating, Price sorting, and an algorithmic Multi-factor Discovery score.

---

## Getting Started

### Option 1: Standalone React App (Vite)
1. Ensure Node.js (v18+) is installed.
2. In the project root, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

### Option 2: Fullstack Express Backend + SQLite (Optional)
If you wish to use a persistent server backend:
1. Navigate to `/backend`:
   ```bash
   cd backend
   npm install
   npm start
   ```
   Runs on `http://localhost:5000`.
