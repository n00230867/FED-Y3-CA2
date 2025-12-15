import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Format appointment_date as dd/mm/yyyy
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

// Format time as HH:MM
function formatTime(timestamp) {
  if (!timestamp) return "";

  const ms = timestamp.toString().length === 10
    ? timestamp * 1000
    : timestamp;

  const date = new Date(ms);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function AppointmentsShow() {
  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const appointmentData = response.data;
        setAppointment(appointmentData);

        // Fetch doctor and patient details
        const [doctorRes, patientRes] = await Promise.all([
          axios.get(`/doctors/${appointmentData.doctor_id}`),
          axios.get(`/patients/${appointmentData.patient_id}`)
        ]);

        setDoctor(doctorRes.data);
        setPatient(patientRes.data);
      } catch (err) {
        console.error("ERROR FETCHING APPOINTMENT:", err.response?.data);
      }
    };

    fetchAppointment();
  }, [id, token]);

  if (!appointment || !doctor || !patient) {
    return <p>Loading appointment...</p>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Appointment #{appointment.id}
        </CardTitle>

        <CardDescription>
          {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_date)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Patient Information</h3>
          <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Doctor Information</h3>
          <p><strong>Name:</strong> Dr. {doctor.first_name} {doctor.last_name}</p>
          <p><strong>Specialisation:</strong> {doctor.specialisation}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
        </div>

        {appointment.reason && (
          <div>
            <p><strong>Reason:</strong> {appointment.reason}</p>
          </div>
        )}
        
        {appointment.status && (
          <div>
            <p><strong>Status:</strong> {appointment.status}</p>
          </div>
        )}
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
