import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconStethoscope,
  IconMail,
  IconPhone,
  IconUsers,
  IconCalendar,
  IconArrowLeft,
  IconEdit,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Show() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [doctorRes, appointmentsRes, patientsRes] = await Promise.all([
          axios.get(`/doctors/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/patients`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDoctor(doctorRes.data);
        
        // Filter appointments for this doctor
        const doctorAppointments = appointmentsRes.data.filter(
          (apt) => apt.doctor_id === parseInt(id)
        );
        setAppointments(doctorAppointments);

        // Get unique patient IDs from appointments
        const patientIds = [...new Set(doctorAppointments.map((apt) => apt.patient_id))];
        const doctorPatients = patientsRes.data.filter((patient) =>
          patientIds.includes(patient.id)
        );
        setPatients(doctorPatients);
      } catch (err) {
        console.error("ERROR FETCHING DATA:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!doctor) {
    return <p>Doctor not found</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/doctors")}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Doctor Profile</h1>
          <p className="text-muted-foreground">View doctor details and related information</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/doctors/${id}/edit`)}>
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Doctor Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <IconStethoscope className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Dr. {doctor.first_name} {doctor.last_name}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  <Badge variant="secondary" className="mt-1">
                    {doctor.specialisation}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IconMail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{doctor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IconPhone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{doctor.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconUsers className="h-5 w-5 text-blue-500" />
              <CardTitle>Patients</CardTitle>
            </div>
            <CardDescription>Total patients under care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5 text-green-500" />
              <CardTitle>Appointments</CardTitle>
            </div>
            <CardDescription>Total appointments scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Patients
          </CardTitle>
          <CardDescription>Patients assigned to this doctor</CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.first_name} {patient.last_name}
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No patients found</p>
          )}
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Appointments
          </CardTitle>
          <CardDescription>All appointments for this doctor</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient ID</TableHead>
                  {appointments.some(apt => apt.status) && <TableHead>Status</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {new Date(appointment.date_time).toLocaleString()}
                    </TableCell>
                    <TableCell>{appointment.patient_id}</TableCell>
                    {appointments.some(apt => apt.status) && (
                      <TableCell>
                        {appointment.status && <Badge variant="outline">{appointment.status}</Badge>}
                      </TableCell>
                    )}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No appointments found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
