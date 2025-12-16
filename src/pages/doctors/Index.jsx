import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";
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
  IconPlus,
  IconEye,
  IconEdit,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function Index() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/doctors");
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Doctor deleted successfully");
    setDoctors(doctors.filter((doctor) => doctor.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <IconStethoscope className="h-8 w-8" />
            Doctors
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your medical staff and view their profiles
          </p>
        </div>
        {token && (
          <Button asChild>
            <Link to="/doctors/create">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Doctor
            </Link>
          </Button>
        )}
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Quick statistics about your doctors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <IconStethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doctors.length}</p>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                <IconStethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(doctors.map(d => d.specialisation)).size}</p>
                <p className="text-sm text-muted-foreground">Specialisations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
          <CardDescription>Complete list of medical staff</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading doctors...</p>
          ) : doctors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialisation</TableHead>
                  <TableHead>Contact</TableHead>
                  {token && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconStethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Dr. {doctor.first_name} {doctor.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">ID: {doctor.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doctor.specialisation}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <IconMail className="h-3 w-3 text-muted-foreground" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconPhone className="h-3 w-3 text-muted-foreground" />
                          {doctor.phone}
                        </div>
                      </div>
                    </TableCell>

                    {token && (
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/doctors/${doctor.id}`)}
                          >
                            <IconEye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                          >
                            <IconEdit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>

                          <DeleteBtn
                            resource="doctors"
                            id={doctor.id}
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
              <IconStethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No doctors found</p>
              {token && (
                <Button asChild className="mt-4">
                  <Link to="/doctors/create">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Your First Doctor
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
