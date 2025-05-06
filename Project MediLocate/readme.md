# MediLocate

## Welcome to MediLocate

MediLocate is a web-based application designed to revolutionize the way people book medical appointments. By bridging the gap between clinics and patients, MediLocate makes accessing healthcare services simple, efficient, and accessible.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [How to Run](#how-to-run)
- [Usage](#usage)
- [Architecture](#architecture)
- [Creators](#creators)

---

## Overview

MediLocate connects users with clinics in **Regina**, **Moose Jaw**, and **Saskatoon**. Users can view clinic details, check available time slots, and book appointments with just a few clicks. It ensures a seamless and efficient process, enhancing both the user and clinic experience.

This project is an example of the combination of Software Engineering principles and the MVC architecture.

---

## Features

- **Clinic Management:** List and manage clinics across multiple cities.
- **Appointment Booking:** View available dates and time slots for clinics and book appointments instantly.
- **Dynamic Availability:** Real-time availability management for clinics.
- **User-Friendly Interface:** A clean and intuitive UI for both patients and administrators.
- **Location-Specific Clinics:** Separate clinic views for Regina, Moose Jaw, and Saskatoon.
- **Responsive Design:** Optimized for desktop and mobile devices.

---

## How It Works

1. **Homepage:**
   - Users are greeted with the homepage, showcasing options for different cities (Regina, Moose Jaw, Saskatoon).
   - Each city directs users to its respective clinic list.

2. **Clinic Listings:**
   - Displays all available clinics in the selected city.
   - Users can view the clinic's details (name, address, image) and click the "Book Appointment" button.

3. **Appointment Booking:**
   - Users select a date from the dynamically populated list of available dates.
   - Upon selecting a date, time slots for that date are displayed.
   - Users choose a time slot and confirm their appointment.

4. **My Appointments:**
   - Users can view their booked appointments, ensuring easy tracking and management.

---

## Technology Stack

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Backend framework for handling routes and APIs.
- **MongoDB**: Database for storing clinic details, availability, and appointments.
- **Mongoose**: ODM for MongoDB.

### Frontend
- **EJS**: Embedded JavaScript for server-side templating.
- **Bootstrap 5**: For a responsive and clean UI.

### Other
- **CSS**: Custom styling.
- **JavaScript**: Dynamic functionalities in the frontend.

---

## Installation

To run MediLocate locally:

1. Cloning
   ```bash
   git clone https://github.com/your-repo/MediLocate.git

## How to Run

1. Clone the repository:
   ```bash
   node app.js


## Usage
1. Sign Up and Log In
 Create an account or log in to access MediLocate.

2. Browse Clinics
 Choose your city and browse the list of clinics.
3. Book an Appointment
 Select a clinic, choose a date and time slot, and book your appointment.
4. View Appointments
 Check the "My Appointments" section to track your bookings.

## Architecture

1. MVC Architecture:
MediLocate is built using the Model-View-Controller (MVC) design pattern, ensuring separation of concerns, scalability, and maintainability:

Model: Handles data logic and interaction with the database (e.g., Clinic.js, Availability.js, Appointment.js).
View: Provides a dynamic, user-friendly interface using EJS templates (e.g., Regina.ejs, MooseJaw.ejs, Saskatoon.ejs).
Controller: Orchestrates data flow between the model and view, handling user requests and business logic (e.g., userController.js).

2. Modularization:
The project is divided into clear modules for routes, models, controllers, and views, making it easier to manage and extend.
Each module focuses on a single responsibility, promoting the Single Responsibility Principle (SRP).

3. Scalability:
The use of MongoDB allows horizontal scaling, accommodating growing data requirements without significant overhead.
The architecture supports adding more cities, clinics, or features with minimal refactoring.

4. Reusability and DRY Principle:
Reusable components such as Bootstrap classes and common templates reduce duplication.
Backend logic is written to ensure reusability across cities and clinics.

5. User-Centric Design:
The project is designed with the user in mind, emphasizing a smooth booking experience.
Real-time availability ensures users have accurate information at all times.

## Creators
MediLocate is proudly built by:

Gursharan Singh - Backend Development, Database Design, and Implementation
Ansar Ahmed - Frontend Design, UI/UX, and Client-Side Features

This project is a testament to collaboration, innovation, and a shared passion for improving healthcare accessibility using the Software Engineering principles and MVC architecture.

## Screenshots
Homepage 

Clinic List

Appointment Booking

## Future Enhancements
1. Clinic staff Dashboard:Add and manage clinic details and availability.
2. Email Notifications: Send email confirmations and reminders for appointments.
3. Multilingual Support: Add support for multiple languages.
4. Search and Filter: Enhance the search functionality for clinics.
5. And much more...