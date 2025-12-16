import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from "react-router";
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
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconStethoscope,
  IconPill,
  IconClipboardList,
  IconArrowLeft,
  IconEdit,
  IconCake,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

// Format date_of_birth as dd/mm/yyyy
function formatDate(timestamp) {
  if (!timestamp) return "";

  const ms = timestamp.toString().length === 10
    ? timestamp * 1000
    : timestamp;

  const date = new Date(ms);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function PatientsShow() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientRes, appointmentsRes, diagnosesRes, prescriptionsRes, doctorsRes] = await Promise.all([
          axios.get(`/patients/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/diagnoses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/prescriptions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/doctors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPatient(patientRes.data);
        
        // Filter data for this patient
        const patientAppointments = appointmentsRes.data.filter(
          (apt) => apt.patient_id === parseInt(id)
        );
        console.log("Patient Appointments:", patientAppointments);
        if (patientAppointments.length > 0) {
          console.log("Sample Appointment:", patientAppointments[0]);
        }
        setAppointments(patientAppointments);

        const patientDiagnoses = diagnosesRes.data.filter(
          (diag) => diag.patient_id === parseInt(id)
        );
        console.log("Patient Diagnoses:", patientDiagnoses);
        if (patientDiagnoses.length > 0) {
          console.log("Sample Diagnosis:", patientDiagnoses[0]);
        }
        setDiagnoses(patientDiagnoses);

        const patientPrescriptions = prescriptionsRes.data.filter(
          (pres) => pres.patient_id === parseInt(id)
        );
        setPrescriptions(patientPrescriptions);

        // Get unique doctor IDs from appointments
        const doctorIds = [...new Set(patientAppointments.map((apt) => apt.doctor_id))];
        const patientDoctors = doctorsRes.data.filter((doctor) =>
          doctorIds.includes(doctor.id)
        );
        setDoctors(patientDoctors);
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

  if (!patient) {
    return <p>Patient not found</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/patients")}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Patient Profile</h1>
          <p className="text-muted-foreground">View patient details and medical records</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/patients/${id}/edit`)}>
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Patient Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <IconUser className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {patient.first_name} {patient.last_name}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Patient ID: {patient.id}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IconCake className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{formatDate(patient.date_of_birth)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IconMail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IconPhone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            </div>
            {patient.address && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2 lg:col-span-3">
                <IconMapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{patient.address}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5 text-blue-500" />
              <CardTitle>Appointments</CardTitle>
            </div>
            <CardDescription>Total scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconClipboardList className="h-5 w-5 text-green-500" />
              <CardTitle>Diagnoses</CardTitle>
            </div>
            <CardDescription>Medical records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{diagnoses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconPill className="h-5 w-5 text-orange-500" />
              <CardTitle>Prescriptions</CardTitle>
            </div>
            <CardDescription>Active medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{prescriptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconStethoscope className="h-5 w-5 text-purple-500" />
              <CardTitle>Doctors</CardTitle>
            </div>
            <CardDescription>Healthcare providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{doctors.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconStethoscope className="h-5 w-5" />
            Doctors
          </CardTitle>
          <CardDescription>Healthcare providers for this patient</CardDescription>
        </CardHeader>
        <CardContent>
          {doctors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialisation</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doctor.specialisation}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>{doctor.email}</div>
                        <div className="text-muted-foreground">{doctor.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/doctors/${doctor.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No doctors assigned</p>
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
          <CardDescription>All appointments for this patient</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => {
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {formatDate(appointment.appointment_date)}
                      </TableCell>
                      <TableCell>{appointment.doctor_id}</TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No appointments found</p>
          )}
        </CardContent>
      </Card>

      {/* Diagnoses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconClipboardList className="h-5 w-5" />
            Diagnoses
          </CardTitle>
          <CardDescription>Medical diagnoses for this patient</CardDescription>
        </CardHeader>
        <CardContent>
          {diagnoses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Condition</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnoses.map((diagnosis) => {
                  return (
                    <TableRow key={diagnosis.id}>
                      <TableCell className="font-medium">{diagnosis.condition}</TableCell>
                      <TableCell>
                        {formatDate(diagnosis.diagnosis_date)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No diagnoses found</p>
          )}
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPill className="h-5 w-5" />
            Prescriptions
          </CardTitle>
          <CardDescription>Active prescriptions for this patient</CardDescription>
        </CardHeader>
        <CardContent>
          {prescriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Doctor ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">{prescription.medication}</TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell>{prescription.doctor_id}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No prescriptions found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
