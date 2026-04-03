# Faunatic Next.js - Animal & Livestock Management Dashboard

Faunatic is a comprehensive private admin dashboard built on **Next.js and Tailwind CSS**, specifically designed for **managing animal/livestock stock, financial transactions, customer tracking, and inventory operations**. This web application provides a complete solution for stock inventory management, transaction processing, and business analytics.

Faunatic utilizes the power of **Next.js 16** (App Router), **React 19**, **Tailwind CSS v4**, and **Supabase** to deliver a robust and scalable application.

## Core Features

### 🐾 Animal Inventory Management
- **Inventory Tracking**: Manage animals with statuses like `ready` (available) and `sold`.
- **Profit Analysis**: Automatically track profit for each animal based on buy and sell prices.
- **Sourcing System**: Handle "Sourcing" states for animals sold before they are in inventory.

### 💰 Transaction System
The project implements a complete financial transaction workflow:
1. **Deposit**: Increase user balance.
2. **Tarik Tunai (Withdrawal)**: Decrease user balance.
3. **Beli Hewan (Buy Animal)**: Purchase animals for inventory (automatically creates animal records).
4. **Jual_hewan (Sell Animal)**: Sell animals from inventory or record a sourcing request.

### 👥 Customer & User Management
- Track customer transactions and balances.
- Manage user profiles and roles.

## Tech Stack

- **Framework**: [Next.js 16.x](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend-as-a-Service**: [Supabase](https://supabase.com/)
- **Data Visualization**: [ApexCharts](https://apexcharts.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Overview

Faunatic is a private dashboard web application designed for comprehensive stock and transaction management. This application enables users to:

- **Manage Animal Stock**: Track inventory status (ready, sold, dead) with real-time updates
- **Process Transactions**: Handle deposits, withdrawals, purchases, and sales with full audit trails
- **Monitor Profitability**: Analyze profit margins and financial performance
- **Customer Management**: Maintain detailed customer and user records with transaction history

## Code Structure

The codebase is well-organized with clear separation of concerns:

- **Components**: Modular React components for UI elements, forms, tables, and modals
- **API Routes**: RESTful API endpoints located in `src/app/api/` for all backend operations
- **Modals**: Dedicated modal components for editing animals, transactions, and sourcing requests
- **Tables**: Data visualization tables with filtering, sorting, and action capabilities
- **Hooks**: Custom React hooks for state management and business logic
- **Context**: Global state management using React Context (Theme, Sidebar)

You can explore the codebase to understand the implementation patterns and customize features to suit your needs.

## Components

The template includes:
* Sophisticated and accessible sidebar
* Data visualization components (Line and Bar charts)
* Animal management and transaction forms
* Profile management and custom 404 page
* Tables for inventory and transaction history
* Authentication flows (Sign-in/Sign-up)
* Dark Mode support 🕶️

## License & Privacy

This is a **private dashboard** application. Faunatic Next.js is released under the MIT License.
