import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ✅ Convert timestamp → dd/mm/yyyy just like PatientsIndex
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

export default function AppointmentsIndex() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/appointments");
        setAppointments(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Appointment deleted successfully");
    setAppointments((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link to="/appointments/create">Create New Appointment</Link>
        </Button>
      )}

      <Table>
        <TableCaption>List of Appointments</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Doctor ID</TableHead>
            <TableHead>Patient ID</TableHead>
            {token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {appointments.map((appt) => (
            <TableRow key={appt.id}>
              {/* ✅ Date formatted nicely */}
              <TableCell>{formatDate(appt.appointment_date)}</TableCell>

              <TableCell>{appt.doctor_id}</TableCell>
              <TableCell>{appt.patient_id}</TableCell>

              {token && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/appointments/${appt.id}`)}
                    >
                      <Eye />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/appointments/${appt.id}/edit`)}
                    >
                      <Pencil />
                    </Button>

                    <DeleteBtn
                      resource="appointments"
                      id={appt.id}
                      onDeleteCallback={onDeleteCallback}
                    />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
