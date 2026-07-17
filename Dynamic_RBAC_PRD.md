# Project Requirements Document (PRD)

# Dynamic Role-Based Access Control (RBAC) System in Angular

**Version:** 1.0  
**Status:** Approved  
**Project Type:** Frontend Only (Showcase / Portfolio Project)  
**Framework:** Angular (Latest Stable - Angular 20+)

---

# 1. Overview

## Objective

Build a complete **Dynamic Role-Based Access Control (RBAC)** system entirely in Angular without using any backend.

Unlike traditional RBAC demos where roles and permissions are hardcoded, this project will allow users to dynamically create application users, assign permissions, edit permissions, and immediately test those permissions inside the application.

The project should demonstrate how enterprise applications implement authorization while keeping the code reusable, scalable and maintainable.

This project is intended as a **showcase project** that demonstrates:

- Angular Architecture
- Authentication Flow
- Authorization (RBAC)
- Route Guards
- Structural Directives
- Dynamic UI Rendering
- Reusable CRUD Architecture
- State Management
- Angular Best Practices

---

# 2. Project Scope

This project is **Frontend Only**.

No backend will be created.

No API calls.

Everything will be simulated using:

- LocalStorage
- Runtime Memory
- Angular Services

Later, the architecture should allow plugging in a real backend without changing the authorization system.

---

# 3. High Level Flow

```
                    Application Starts
                            │
                            ▼
                Access Management Screen
                            │
                            ▼
            Create User + Assign Permissions
                            │
                            ▼
         Encrypt & Save User in LocalStorage
                            │
                            ▼
               User Management Screen
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
         Edit User                    Test Login
                                            │
                                            ▼
                                      Login Screen
                                            │
                                            ▼
                                   Authenticate User
                                            │
                                            ▼
                                  Permission Service
                                            │
          ┌─────────────────────────────────┼──────────────────────────┐
          ▼                                 ▼                          ▼
    Route Guard                      Sidebar/Menu               UI Permissions
                                                                  (*Directive)
```

---

# 4. Technology Stack

## Angular

Use:

- Angular 20 (Latest Stable)

Reason:

- Standalone Components
- Functional Guards
- Signals Support
- Modern Angular APIs
- Better Performance
- Future Ready

---

## Styling

Angular Material

Reasons:

- Professional UI
- Accordion
- Cards
- Toolbar
- Table
- Form Controls
- Dialogs

---

## State

Use Angular Signals wherever suitable.

Runtime module data can be managed through Angular Services.

---

# 5. Modules

Application contains four business modules.

```
User Management

Employee Management

Driver Management

Vehicle Management
```

Each module supports:

```
View

Create

Update

Delete
```

---

# 6. Access Management Module

This is the first screen users land on.

Instead of creating Roles,

we are creating Users with permissions.

## Fields

```
Name

Alias (Unique)

Email (Unique)

Password

Confirm Password
```

## Validation Rules

Email

- Required
- Valid Email Format
- Must be unique

Alias

- Required
- Must be unique

Password

- Required

Confirm Password

- Must match Password

Below the form,

permission assignment section will appear.

---

# 7. Permission Assignment UI

Use Accordion UI.

Example:

```
▶ User Management

▶ Employee Management

▶ Driver Management

▶ Vehicle Management
```

Expanding:

```
▼ User Management

☑ View

☑ Create

☐ Update

☐ Delete
```

---

# 8. Permission Rules

Rule 1

Selecting

```
Create

Update

Delete
```

must automatically select

```
View
```

---

Rule 2

If user unchecks

```
View
```

then

```
Create

Update

Delete
```

must also become unchecked.

---

Rule 3

Permissions should never exist without View.

Invalid Example

```
Create = true

View = false
```

---

# 9. User Storage

Users will be stored in LocalStorage.

Password and permission object should be encrypted before storing.

Example:

```
LocalStorage

users
```

Contains:

```
[
   User1,
   User2,
   User3
]
```

---

# 10. User JSON Structure

```json
{
  "id": "USR-001",
  "name": "John Doe",
  "email": "john@test.com",
  "password": "<encrypted>",
  "isSuperAdmin": false,
  "permissions": {
    "user_management": {
      "view": true,
      "create": true,
      "update": false,
      "delete": false
    },
    "employee_management": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "driver_management": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "vehicle_management": {
      "view": true,
      "create": true,
      "update": true,
      "delete": false
    }
  },
  "createdAt": "2026-07-15T10:20:00Z"
}
```

---

# 11. Permission Engine

Although permissions are stored as nested JSON,

PermissionService will convert them into a Set during login.

Example

Stored

```json
{
  "vehicle_management": {
    "view": true,
    "create": true
  }
}
```

Converted into

```
Set

vehicle_management.view

vehicle_management.create
```

Permission checking becomes

```
permissionSet.has(permission)
```

instead of traversing nested JSON repeatedly.

Benefits

- Faster
- Cleaner
- Better Performance

---

# 12. Permission Constants

Never use string literals.

Bad

```
"user_management.create"
```

Good

```ts
Permissions.USER.CREATE;
```

Example

```ts
export const Permissions = {
  USER: {
    VIEW: "user_management.view",
    CREATE: "user_management.create",
    UPDATE: "user_management.update",
    DELETE: "user_management.delete",
  },
};
```

---

# 13. User Management Screen

After creating users,

display all users in a Material Table.

Columns

Alias | Name | Email | Actions

Actions

- Edit
- Delete

A single **Test Login** button should be placed at the top-right corner above the table.

Clicking **Test Login** navigates the user to the Login screen, where any previously created user can authenticate.

---

# 14. Edit User

Editing should reuse

Create User Component.

Same component

Different Mode.

```
Create Mode

Edit Mode
```

Permissions must patch correctly.

---

# 15. Login Flow

```
Login

↓

Validate Email

↓

Validate Password

↓

Decrypt Permissions

↓

Initialize Permission Service

↓

Navigate Dashboard
```

---

# 16. Dashboard

Dashboard should not show every module.

Only modules having

```
View Permission
```

should appear.

Display modules as cards.

Example

```
User Management

Driver Management
```

Vehicle module should not appear if View permission is false.

---

# 17. Sidebar

Sidebar should also be generated dynamically.

Every menu item contains

```
Label

Route

Permission
```

Example

```ts
{
    label:'Vehicle',
    route:'/vehicle',
    permission:Permissions.VEHICLE.VIEW
}
```

Sidebar filters itself based on permissions.

---

# 18. Route Protection

Use Functional Guard.

Single Guard.

```
PermissionGuard
```

Routes

```ts
{
    path:'vehicle',

    canActivate:[PermissionGuard],

    data:{
        permission:Permissions.VEHICLE.VIEW
    }
}
```

Guard asks

```
PermissionService
```

If false

Redirect

```
Unauthorized
```

---

# 19. Frontend Authorization

Create Structural Directive.

```
*appHasPermission
```

Usage

```html
<button *appHasPermission="Permissions.USER.CREATE">Create User</button>
```

Never call PermissionService repeatedly from templates.

---

# 20. Supported Permission Modes

Support

Single Permission

```
USER.CREATE
```

AND

```
USER.CREATE

AND

USER.UPDATE
```

OR

```
USER.CREATE

OR

USER.UPDATE
```

Implementation should allow extending to these modes.

---

# 21. Super Admin

If

```
isSuperAdmin = true
```

Permission checks are skipped.

Everything becomes accessible.

---

# 22. Module Structure

Every module follows identical architecture.

```
List Page

↓

Create Button

↓

Create/Edit Form

↓

Back to List
```

Action Column

```
Edit

Delete
```

Visibility controlled by permissions.

---

# 23. Runtime Data

Each module contains

```
2 Static Entries
```

User can create

```
Maximum 3 Additional Entries
```

Total

```
5 Records
```

These records exist only in runtime memory.

Refreshing browser restores original 2 records.

Do NOT store module data in LocalStorage.

---

# 24. CRUD Components

Each module must use

Single Component

for

```
Create

Update
```

Behavior changes based on

- Route
- Route Parameters
- Incoming Data

No duplicate Create/Edit components.

---

# 25. Logout

Logout option should always remain visible.

Can be placed in

- Navbar
- Toolbar

Logout clears

- Current Session
- Permission Cache

Then navigates

```
Login
```

---

# 26. Services

## AuthService

Responsibilities

- Login
- Logout
- Session
- Encryption
- Decryption

---

## UserService

Responsibilities

- Create User
- Update User
- Get Users
- Delete User (optional)
- Validate Unique Email
- Validate Unique Alias

---

## PermissionService

Responsibilities

- Initialize Permissions
- Convert JSON → Set
- Check Permissions
- Super Admin Handling
- AND/OR Logic

---

## RuntimeDataService

Responsibilities

Maintain CRUD records in memory.

---

# 27. Guard

Single Guard

```
PermissionGuard
```

Responsibilities

- Read Route Permission
- Ask PermissionService
- Redirect Unauthorized Users

---

# 28. Directive

```
appHasPermission
```

Responsibilities

Hide/Show

- Buttons
- Sections
- Tables
- Cards
- Forms

---

# 29. Folder Structure

```
src

core

    auth

    guards

    directives

    services

    constants

pages

    access-management

    login

    dashboard

    user

    employee

    driver

    vehicle

shared

    components

    models

    pipes

    utils

layout

    navbar

    sidebar

    toolbar
```

---

# 30. Future Backend Compatibility

Only one layer should change when backend is introduced.

Current

```
Hardcoded User

↓

LocalStorage
```

Future

```
Backend API

↓

PermissionService

↓

Everything Else Works
```

No changes required to

- Guard
- Directive
- Sidebar
- Components
- Dashboard

---

# 31. Learning Outcomes

By completing this project, the developer should demonstrate knowledge of:

- Modern Angular Architecture
- Dynamic RBAC
- Authentication
- Authorization
- Functional Guards
- Structural Directives
- Angular Signals
- Standalone Components
- Reactive UI
- LocalStorage Management
- Runtime State Management
- Reusable CRUD Architecture
- Enterprise Folder Structure
- Clean Code Principles
- Separation of Concerns
- Scalability
- Maintainability

---

# 32. Final Goal

Build a reusable, scalable and production-inspired Dynamic RBAC framework in Angular that demonstrates the complete lifecycle of authentication, authorization and permission-driven UI without relying on a backend.

The project should serve as a portfolio-quality implementation that can later be connected to a real backend with minimal changes while showcasing Angular best practices and enterprise application architecture.
