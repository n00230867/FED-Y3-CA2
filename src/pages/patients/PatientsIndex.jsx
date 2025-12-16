import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import DeleteBtn from "@/components/DeleteBtn";
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
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  IconUsers,
  IconPlus,
  IconEye,
  IconEdit,
  IconMail,
  IconPhone,
  IconCake,
} from "@tabler/icons-react";
import { toast } from "sonner";

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

export default function PatientsIndex() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/patients");
        setPatients(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Patient deleted successfully");
    setPatients(patients.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <IconUsers className="h-8 w-8" />
            Patients
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage patient records and medical information
          </p>
        </div>
        {token && (
          <Button asChild>
            <Link to="/patients/create">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Patient
            </Link>
          </Button>
        )}
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Quick statistics about your patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <IconUsers className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                <IconUsers className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patients.filter(p => p.email).length}</p>
                <p className="text-sm text-muted-foreground">Active Records</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>Complete list of registered patients</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading patients...</p>
          ) : patients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Contact</TableHead>
                  {token && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconUsers className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {patient.first_name} {patient.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconCake className="h-4 w-4 text-muted-foreground" />
                        {formatDate(patient.date_of_birth)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <IconMail className="h-3 w-3 text-muted-foreground" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconPhone className="h-3 w-3 text-muted-foreground" />
                          {patient.phone}
                        </div>
                      </div>
                    </TableCell>

                    {token && (
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            <IconEye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/patients/${patient.id}/edit`)}
                          >
                            <IconEdit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>

                          <DeleteBtn
                            resource="patients"
                            id={patient.id}
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
              <IconUsers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No patients found</p>
              {token && (
                <Button asChild className="mt-4">
                  <Link to="/patients/create">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Your First Patient
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
