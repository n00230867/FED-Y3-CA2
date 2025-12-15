import { AuthProvider } from "./hooks/useAuth";

import { BrowserRouter as Router, Routes, Route } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

import Home from "@/pages/Home";
import ProtectedRoute from "@/pages/ProtectedRoute";

// Doctors
import DoctorsIndex from "@/pages/doctors/Index";
import DoctorsShow from "@/pages/doctors/Show";
import DoctorsCreate from "@/pages/doctors/Create";
import DoctorsEdit from "@/pages/doctors/Edit";

// Patients
import PatientsIndex from "@/pages/patients/PatientsIndex";
import PatientsShow from "@/pages/patients/PatientsShow";
import PatientsCreate from "@/pages/patients/PatientsCreate";
import PatientsEdit from "@/pages/patients/PatientsEdit";

// Appointments
import AppointmentsIndex from "@/pages/appointments/AppointmentsIndex";
import AppointmentsCreate from "@/pages/appointments/AppointmentsCreate";
import AppointmentsShow from "@/pages/appointments/AppointmentsShow";
import AppointmentsEdit from "@/pages/appointments/AppointmentsEdit";

import FormExamples from "@/pages/examples/Forms";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider
          style={{
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          }}
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />

            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-2 py-4 md:gap-2 md:py-6 mx-6">

                  <Routes>

                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/doctors" element={<DoctorsIndex />} />
                    <Route path="/patients" element={<PatientsIndex />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>

                      {/* Doctors */}
                      <Route path="/doctors/:id" element={<DoctorsShow />} />
                      <Route path="/doctors/:id/edit" element={<DoctorsEdit />} />
                      <Route path="/doctors/create" element={<DoctorsCreate />} />

                      {/* Patients */}
                      <Route path="/patients/:id" element={<PatientsShow />} />
                      <Route path="/patients/:id/edit" element={<PatientsEdit />} />
                      <Route path="/patients/create" element={<PatientsCreate />} />

                      {/* Appointments */}
                      <Route path="/appointments" element={<AppointmentsIndex />} />
                      <Route path="/appointments/create" element={<AppointmentsCreate />} />
                      <Route path="/appointments/:id/edit" element={<AppointmentsEdit />} />
                      <Route path="/appointments/:id" element={<AppointmentsShow />} />

                    </Route>

                    <Route path="/forms" element={<FormExamples />} />

                  </Routes>

                </div>
              </div>
            </div>

          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}
