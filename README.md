# Dynamic Role-Based Access Control (RBAC) System

A robust, portfolio-quality frontend implementation of a **Dynamic Role-Based Access Control (RBAC)** system built using Angular. Unlike traditional demos with static roles, this application lets you dynamically define users, assign granular permissions, and instantly test the security constraints without any backend services.

---

## 🚀 Live Demo

You can explore the live deployment of this project here:
👉 **[Dynamic RBAC Live Application](https://dynamic-rbac.vercel.app/)** *(Note: If hosting on a custom URL, replace this placeholder link)*

---

## 📌 Project Overview

This project showcases how enterprise Angular applications manage complex authorization structures. By using a frontend-first architecture, all operations are handled locally:
- **Persistent Storage**: Application users, credentials, and custom permissions are securely stored/encrypted in `LocalStorage`.
- **Runtime Memory**: Mock business records (Users, Employees, Drivers, Vehicles) are held in memory and reset on reload, ensuring a clean slate for testing.

Later, this decoupled architecture allows plugging in a real backend API by replacing only the service layers, without altering the route guards or custom directives.

---

## ⚙️ Key Features

- **Access Management**: A unified dashboard to create, update, and delete application users, and configure granular permissions.
- **Granular Permissions Assignment**: An accordion-based module checklist enforcing standard authorization rules (e.g., selecting *Create/Update/Delete* automatically enables *View*; deselecting *View* disables all actions).
- **Performant Permission Engine**: Converts nested user permission JSON into a lookup `Set` (`permissionSet.has(permission)`) on initialization for lightning-fast security checks.
- **Functional Route Guard**: A reusable `permissionGuard` protecting Angular routes by resolving route metadata.
- **Structural Directive**: An custom structural directive (`*appHasPermission`) for fine-grained UI element rendering (e.g., hiding action buttons based on user permissions).
- **Super Admin Bypass**: A master role switch that bypasses all verification checks, granting access to every resource.

---

## 🛠️ Tech Stack & Concepts Demonstrated

- **Angular 21** (Standalone Components, Signals, Functional Guards, Dependency Injection)
- **State Management**: Reactive data flows using Angular Signals.
- **Security**: Local storage security simulation (JSON encryption/decryption using Base64 encoding).
- **Styling**: Highly polished, modern, and responsive custom UI layout (no third-party CSS dependencies).
- **Testing**: Modern Angular test environment using Vitest.

---

## 🏃‍♂️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have Node.js (v18+) and npm installed on your system.

### 1. Install Dependencies

Clone this repository and run:

```bash
npm install
```

### 2. Run the Development Server

Start the local development server:

```bash
npm start
```

Once started, open your browser and navigate to:
👉 **`http://localhost:4200/`**

The application will automatically hot-reload whenever you modify source files.

### 3. Build for Production

Compile the project and optimize it for production deployment:

```bash
npm run build
```

The production bundle will be generated under the `dist/` directory.

### 4. Running Unit Tests

To run the unit test suite using the Vitest test runner, run:

```bash
npm run test
```

---

## 📂 Project Structure

```
src/app
 ├── core/
 │    ├── constants/     # Reusable system permissions constants
 │    ├── directives/    # Structural directives (*appHasPermission)
 │    ├── guards/        # Router protection (permissionGuard)
 │    └── services/      # Business logic (AuthService, PermissionService, UserService)
 ├── pages/
 │    ├── access-management/  # User creation & permission configuration screen
 │    ├── login/              # Secure sign-in screen
 │    ├── dashboard/          # Dynamic workspace rendering accessible modules
 │    └── user/employee/...  # Protected operational business modules
 └── shared/
      ├── models/        # TypeScript interfaces and entity data models
      └── components/    # Reusable shared components
```
