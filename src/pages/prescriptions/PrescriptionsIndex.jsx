import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import DeleteBtn from "@/components/DeleteBtn";
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
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  IconPill,
  IconPlus,
  IconEye,
  IconEdit,
  IconCalendar,
} from "@tabler/icons-react";

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

export default function PrescriptionsIndex() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get("/prescriptions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPrescriptions(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [location.key, token]);

  const onDeleteCallback = (id) => {
    toast.success("Prescription deleted successfully");
    setPrescriptions((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <IconPill className="h-8 w-8" />
            Prescriptions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage medication prescriptions and dosages
          </p>
        </div>
        {token && (
          <Button asChild>
            <Link to="/prescriptions/create">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Prescription
            </Link>
          </Button>
        )}
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Quick statistics about prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30">
            <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
              <IconPill className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{prescriptions.length}</p>
              <p className="text-sm text-muted-foreground">Total Prescriptions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>All Prescriptions</CardTitle>
          <CardDescription>Complete list of medication prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading prescriptions...</p>
          ) : prescriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Duration</TableHead>
                  {token && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconPill className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{prescription.medication}</p>
                          <p className="text-sm text-muted-foreground">ID: {prescription.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Patient {prescription.patient_id}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{prescription.dosage}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <IconCalendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(prescription.start_date)}
                        </div>
                        <div className="text-muted-foreground">
                          to {formatDate(prescription.end_date)}
                        </div>
                      </div>
                    </TableCell>

                    {token && (
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                          >
                            <IconEye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}
                          >
                            <IconEdit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>

                          <DeleteBtn
                            resource="prescriptions"
                            id={prescription.id}
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
              <IconPill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No prescriptions found</p>
              {token && (
                <Button asChild className="mt-4">
                  <Link to="/prescriptions/create">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Your First Prescription
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
