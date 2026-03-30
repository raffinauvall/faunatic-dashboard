# Project Analysis: Faunatic Next.js Dashboard

This document provides a comprehensive analysis of the Faunatic project, covering its architecture, tech stack, business logic, and potential areas for improvement.

## 1. Tech Stack Overview

- **Framework**: [Next.js 16.x](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Backend-as-a-Service**: [Supabase](https://supabase.com/)
- **Data Visualization**: [ApexCharts](https://apexcharts.com/) via `react-apexcharts`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Other Notable Packages**: `flatpickr` (Date picking), `jsvectormap` (Maps), `swiper` (Sliders).

## 2. Project Architecture

The project follows the standard Next.js App Router structure:

- **Routing**:
    - `src/app/(admin)`: Contains the main dashboard logic, animal management, and transaction history.
    - `src/app/(full-width-pages)`: Handles Authentication (Sign-in/Sign-up) and Error pages.
- **API Layer**:
    - `src/app/api/`: Implements RESTful endpoints that communicate with Supabase. This acts as a secure bridge, preventing direct exposure of service role keys to the client.
- **Components**:
    - `src/components/`: Modular UI components organized by feature (e.g., `ecommerce`, `tables`, `form`).
- **Layouts**:
    - `src/layout/`: Shared UI structures like the Sidebar and Header.
- **Context**:
    - `src/context/`: React Context for managing global UI state such as Theme (Dark/Light mode) and Sidebar expansion.

## 3. Core Business Logic & Data Flow

### Animal Inventory Management
- **Table**: `animals`
- **Statuses**: `ready` (available), `sold` (out of stock).
- **Profit Tracking**: Calculated as `sell_price - buy_price`.

### Transaction System
Transactions are the heartbeat of the application, categorized into four types:
1. **Deposit**: Increases user balance.
2. **Tarik Tunai (Withdrawal)**: Decreases user balance.
3. **Beli Hewan (Buy Animal)**:
    - Decreases user balance.
    - Automatically creates a new record in the `animals` table with status `ready`.
4. **Jual Hewan (Sell Animal)**:
    - Increases user balance.
    - Updates the corresponding animal record to status `sold` and sets its `sell_price`.
    - Handles "Sourcing" state if an animal is sold before it is in inventory.

### Data Flow Example (Create Transaction)
1. User submits form in `src/components/form/form-elements/transaction-form/TransactionForm.tsx`.
2. Frontend calls `POST /api/transactions`.
3. `src/app/api/transactions/route.ts` handles:
    - Customer creation/retrieval.
    - Animal status updates (for `jual_hewan` or `beli_hewan`).
    - Recording the transaction in the `transactions` table.

## 4. Security & Middleware

- **Authentication**: A simple cookie-based session management.
- **Middleware**: `src/middleware.ts` intercepts requests to ensure a `session` cookie exists for all routes except `/signin` and public assets.
- **Environment Variables**: Sensitive credentials (Supabase URL, Admin credentials) are stored in `.env` (not tracked in Git).

## 5. Potential Bottlenecks & Improvements

### Performance
- **Client-side Aggregations**: Currently, the dashboard calculates totals (Total Profit, Total Sales) by fetching all records and processing them in the browser. As the dataset grows, this will degrade performance.
- **Solution**: Implement Supabase **RPC (Stored Procedures)** or **Views** to perform these aggregations on the database level.

### Validation
- **Manual Checks**: Validation is currently manual (e.g., `if (!formData.user_id) ...`).
- **Solution**: Integrate **Zod** for schema validation and **React Hook Form** for better form state management and error handling.

### Authentication
- **Simplicity**: The current system uses a single hardcoded admin user.
- **Solution**: Migrate to **Supabase Auth** to support multiple users, secure password hashing, and role-based access control (RBAC).

### Testing
- **Absence of Tests**: There are no unit or end-to-end tests.
- **Solution**: Add **Jest** for logic testing (especially the transaction/profit math) and **Playwright** for critical user flows like creating transactions and logging in.

### Database Integrity
- **Logic in API**: Much of the business logic (like updating animal status on sale) lives in the API route.
- **Solution**: Use **Database Triggers** or **Functions** in Supabase to ensure data consistency even if an API call fails mid-execution.
