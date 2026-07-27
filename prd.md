# Product Requirements Document (PRD)

# Smart Society Hub

**Version:** 1.0

**Status:** Draft

**Prepared By:** Team

**Tech Stack**

- React (Frontend)
- Node.js
- Express.js
- MongoDB Compass
- SQLite3
- JWT Authentication
- Socket.IO
- Cloudinary
- React Query
- Zustand
- Tailwind CSS

---

# 1. Product Overview

Smart Society Hub is an all-in-one digital platform that simplifies the management of residential societies by connecting residents, committee members, security guards, maintenance staff, and vendors through one centralized system.

The platform streamlines visitor management, maintenance requests, community communication, billing, security monitoring, facility booking, and emergency response while providing administrators with real-time insights and analytics.

---

# 2. Problem Statement

Most apartment societies still rely on WhatsApp groups, paper registers, phone calls, and spreadsheets.

This leads to:

- Poor visitor tracking
- Delayed maintenance resolution
- Lack of communication
- Billing confusion
- Parking disputes
- Poor security records
- No centralized complaint system

Smart Society Hub solves these problems through a modern web platform.

---

# 3. Goals

- Digitize society operations
- Improve resident communication
- Increase security
- Automate visitor management
- Simplify maintenance workflows
- Provide analytics for committee members
- Enable real-time collaboration

---

# 4. User Roles

## Resident

Can

- Register/Login
- Invite Visitors
- Book Amenities
- Raise Complaints
- Pay Maintenance
- Report Lost & Found
- Join Community Marketplace
- Receive Notifications
- Vote in Polls

---

## Committee Member

Can

- Approve Residents
- Create Notices
- Manage Polls
- Monitor Complaints
- Manage Vendors
- View Reports
- Manage Parking
- View Analytics

---

## Security Guard

Can

- Scan Visitor QR
- Verify Entry
- Verify Exit
- View Expected Visitors
- Raise Security Incidents
- Emergency Alert

---

## Maintenance Staff

Can

- Receive Assigned Complaints
- Update Work Status
- Upload Completion Images
- Track Pending Tasks

---

## Vendor

Can

- Receive Service Requests
- Accept Jobs
- Upload Bills
- Mark Completion

---

# 5. Functional Modules

---

## Authentication

Features

- JWT Login
- Role Based Access
- Forgot Password
- Email Verification
- Profile Management

---

## Visitor Management

Features

- QR Visitor Pass
- Visitor Approval
- Visitor Logs
- Entry/Exit Tracking
- Expected Visitors
- Temporary Passes

---

## Complaint Management

Features

- Raise Complaint
- Complaint Categories
- Priority Levels
- Assign Staff
- Status Tracking
- Image Upload
- Feedback

---

## Maintenance Billing

Features

- Monthly Bills
- Online Payment
- Payment History
- Due Alerts
- Receipts

---

## Parking Management

Features

- Vehicle Registration
- Parking Slot Allocation
- Guest Parking
- Parking Availability
- Vehicle Logs

---

## Community Marketplace

Residents can

- Sell Items
- Buy Items
- Exchange Goods
- Post Ads

---

## Notice Board

Committee can

- Publish Notices
- Pin Important Updates
- Event Announcements
- Emergency Notices

---

## Event Management

Features

- Society Events
- RSVP
- Attendance
- Event Photos

---

## Facility Booking

Residents can book

- Club House
- Gym
- Swimming Pool
- Hall
- Tennis Court

Booking includes

- Time Slot
- Payment
- Approval

---

## Polls & Voting

Committee can create

- Polls
- Voting
- Elections
- Surveys

Residents vote digitally.

---

## Lost & Found

Residents can

- Report Lost Item
- Report Found Item
- Chat with Finder
- Mark Resolved

---

## CCTV Incident Reports

Security can

- Create Incident
- Upload Evidence
- Assign Priority
- Notify Committee

---

## Emergency SOS

Residents press SOS.

Nearest

- Security
- Committee
- Maintenance

receive alerts instantly.

---

## Notification System

Real-time

- Visitor Arrived
- Complaint Updates
- Bill Due
- Poll Created
- Event Reminder
- Booking Approved

(Socket.IO)

---

## Analytics Dashboard

Committee Dashboard

- Total Residents
- Visitor Trends
- Monthly Revenue
- Pending Complaints
- Complaint Categories
- Facility Usage
- Parking Occupancy
- Security Incidents

---

# 6. AI Features (Optional)

Inspired by DevPilot AI

## AI Complaint Categorizer

Automatically classifies complaints.

Example

> "Water leaking from ceiling"

↓

Category

> Plumbing

Priority

> High

---

## AI Notice Generator

Committee types

"Water supply will be off tomorrow"

AI generates professional notice.

---

## AI Society Assistant

Residents ask

"When is my maintenance due?"

"What facilities are available?"

"Who is today's security guard?"

---

## AI Complaint Summary

Summarizes monthly complaints.

---

## AI Maintenance Prediction

Predicts

- Frequent issues
- Maintenance trends

---

# 7. Real-Time Features

Socket.IO

- Chat
- Notifications
- Visitor Entry
- Complaint Status
- SOS Alerts
- Poll Updates

---

# 8. Database Architecture

## SQLite3

Store

- Users
- Roles
- Authentication
- Permissions

Reason

Fast structured relational data.

---

## MongoDB

Store

- Complaints
- Visitors
- Notices
- Marketplace
- Events
- Chat Messages
- Polls
- Analytics
- Notifications

Reason

Flexible document structure.

---

# 9. Suggested Folder Structure

```
SmartSocietyHub/

client/

server/

ai-engine/ (future)

database/

docs/

```

---

# 10. Future Scope

- Mobile App
- Face Recognition Entry
- Smart Gate IoT Integration
- CCTV AI Detection
- Smart Electricity Monitoring
- Water Consumption Analytics
- Voice Assistant
- Smart Home Integration
- Visitor Face Verification
- Digital Society Wallet

---

# 11. Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- React Query
- Zustand
- Framer Motion

### Backend

- Node.js
- Express.js
- Socket.IO
- JWT
- Multer

### Database

- MongoDB Compass
- SQLite3

### Storage

- Cloudinary

### Authentication

- JWT
- Google OAuth (Optional)

### Charts

- Chart.js / Recharts

---

## Features Summary

### Users

- Resident
- Committee Member
- Security Guard
- Maintenance Staff
- Vendor

### Core Modules

- Authentication & RBAC
- Visitor QR Pass Management
- Complaint Management
- Maintenance Billing
- Parking Management
- Community Marketplace
- Notice Board
- Event Management
- Facility Booking
- Polls & Digital Voting
- Lost & Found
- CCTV Incident Reporting
- Emergency SOS
- Real-time Notifications
- Role-based Dashboards
- Analytics & Reports
- AI Complaint Categorization _(Optional)_
- AI Notice Generator _(Optional)_
- AI Society Assistant _(Optional)_

This scope is well-balanced for a major MERN project: it is ambitious enough to stand out, but each module is practical to implement incrementally. It also leaves room to add AI capabilities later without making them a dependency for the core system.
