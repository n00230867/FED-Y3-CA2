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
  IconClipboardList,
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

export default function DiagnosesIndex() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get("/diagnoses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDiagnoses(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch diagnoses");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [token]);

  const onDeleteCallback = (id) => {
    toast.success("Diagnosis deleted successfully");
    setDiagnoses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <IconClipboardList className="h-8 w-8" />
            Diagnoses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage patient diagnoses and medical conditions
          </p>
        </div>
        {token && (
          <Button asChild>
            <Link to="/diagnoses/create">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Diagnosis
            </Link>
          </Button>
        )}
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Quick statistics about diagnoses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/30">
              <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center">
                <IconClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{diagnoses.length}</p>
                <p className="text-sm text-muted-foreground">Total Diagnoses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                <IconClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(diagnoses.map(d => d.condition)).size}</p>
                <p className="text-sm text-muted-foreground">Unique Conditions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnoses Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>All Diagnoses</CardTitle>
          <CardDescription>Complete list of patient diagnoses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading diagnoses...</p>
          ) : diagnoses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Condition</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Date</TableHead>
                  {token && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnoses.map((diagnosis) => (
                  <TableRow key={diagnosis.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconClipboardList className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{diagnosis.condition}</p>
                          <p className="text-sm text-muted-foreground">ID: {diagnosis.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Patient {diagnosis.patient_id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(diagnosis.diagnosis_date)}
                      </div>
                    </TableCell>

                    {token && (
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
                          >
                            <IconEye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
                          >
                            <IconEdit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>

                          <DeleteBtn
                            resource="diagnoses"
                            id={diagnosis.id}
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
              <IconClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No diagnoses found</p>
              {token && (
                <Button asChild className="mt-4">
                  <Link to="/diagnoses/create">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Your First Diagnosis
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
