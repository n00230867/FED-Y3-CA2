# 🏥 Medical Clinic Management System

A comprehensive medical clinic management application built with React and Vite. This full-stack solution provides complete CRUD operations for managing patients, doctors, diagnoses, appointments, and prescriptions with an intuitive user interface.

## ✨ Features

- **Patient Management** - Create, view, update, and delete patient records
- **Doctor Management** - Manage doctor profiles with specializations
- **Diagnosis Tracking** - Record and track patient diagnoses
- **Appointment Scheduling** - Schedule and manage patient appointments
- **Prescription Management** - Create and track prescriptions with medication details
- **Authentication System** - Secure login with JWT tokens
- **Responsive UI** - Built with Radix UI and Tailwind CSS for a modern, accessible interface
- **Real-time Validation** - Client-side form validation with helpful error messages
- **Smart Dropdowns** - Searchable select components for better UX

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd FED-Y3-CA2
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router v7
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Notifications:** Sonner (Toast notifications)
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   └── ...              # App-specific components
├── config/              # Configuration files
│   └── api.js          # Axios instance and API configuration
├── hooks/               # Custom React hooks
│   └── useAuth.jsx     # Authentication hook
├── pages/               # Page components
│   ├── patients/       # Patient CRUD pages
│   ├── doctors/        # Doctor CRUD pages
│   ├── diagnoses/      # Diagnosis CRUD pages
│   ├── appointments/   # Appointment CRUD pages
│   └── prescriptions/  # Prescription CRUD pages
└── lib/                # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

The application connects to a REST API at `https://ca2-med-api.vercel.app`

### Authentication
All protected routes require a Bearer token in the Authorization header:
```javascript
Authorization: Bearer <your-token>
```

### Endpoints
- `/patients` - Patient management
- `/doctors` - Doctor management
- `/diagnoses` - Diagnosis management
- `/appointments` - Appointment management
- `/prescriptions` - Prescription management

## 🎨 Key Features Explained

### Smart Select Components
Dropdowns automatically fetch and display related data (patients, doctors, diagnoses) with readable formats like "#{id} - First Name Last Name".

### Automatic Data Refresh
Lists automatically refresh when you navigate back from create/edit pages using React Router's location key.

### Error Handling
Comprehensive error handling with user-friendly toast notifications for all API operations.

### Date Formatting
Consistent date formatting across the application (dd/mm/yyyy display, ISO format for API).

## 📝 Usage Example

### Creating a Prescription
1. Navigate to Prescriptions page
2. Click "Create Prescription"
3. Select patient from dropdown
4. Select doctor from dropdown
5. Select diagnosis from dropdown
6. Enter medication and dosage
7. Set start and end dates
8. Submit - validation ensures all fields are filled

## 🔐 Authentication

Login credentials are managed through the authentication system. Tokens are stored in localStorage and automatically included in API requests.

## 🤝 Contributing

This is a student project for Front-End Development Year 3 CA2.

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Development Notes

- Forms include both HTML5 validation and custom JavaScript validation
- DeleteBtn component uses a confirmation pattern (click once to confirm, twice to delete)
- All CRUD operations include success/error toast notifications
- Responsive design works across desktop, tablet, and mobile devices
