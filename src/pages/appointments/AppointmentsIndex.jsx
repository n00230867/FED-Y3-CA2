import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
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
  IconCalendar,
  IconPlus,
  IconEye,
  IconEdit,
} from "@tabler/icons-react";

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
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Appointment deleted successfully");
    setAppointments((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <IconCalendar className="h-8 w-8" />
            Appointments
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage patient appointments
          </p>
        </div>
        {token && (
          <Button asChild>
            <Link to="/appointments/create">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Appointment
            </Link>
          </Button>
        )}
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Quick statistics about appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
            <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
              <IconCalendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{appointments.length}</p>
              <p className="text-sm text-muted-foreground">Total Appointments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>Complete list of scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading appointments...</p>
          ) : appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appointment</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Doctor ID</TableHead>
                  {token && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconCalendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{formatDate(appt.appointment_date)}</p>
                          <p className="text-sm text-muted-foreground">ID: {appt.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Patient {appt.patient_id}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Doctor {appt.doctor_id}</Badge>
                    </TableCell>

                    {token && (
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/appointments/${appt.id}`)}
                          >
                            <IconEye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/appointments/${appt.id}/edit`)}
                          >
                            <IconEdit className="h-4 w-4 mr-1" />
                            Edit
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
          ) : (
            <div className="text-center py-12">
              <IconCalendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments found</p>
              {token && (
                <Button asChild className="mt-4">
                  <Link to="/appointments/create">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Schedule Your First Appointment
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
