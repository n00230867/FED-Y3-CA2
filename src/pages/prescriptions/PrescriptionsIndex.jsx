import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

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
      }
    };

    fetchPrescriptions();
  }, [location.key, token]);

  const onDeleteCallback = (id) => {
    toast.success("Prescription deleted successfully");
    setPrescriptions((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/prescriptions/create">Create New Prescription</Link>
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>A list of all prescriptions.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient ID</TableHead>
            <TableHead>Doctor ID</TableHead>
            <TableHead>Diagnosis ID</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell>{prescription.id}</TableCell>
              <TableCell>{prescription.patient_id}</TableCell>
              <TableCell>{prescription.doctor_id}</TableCell>
              <TableCell>{prescription.diagnosis_id}</TableCell>
              <TableCell>{prescription.medication}</TableCell>
              <TableCell>{prescription.dosage}</TableCell>
              <TableCell>{formatDate(prescription.start_date)}</TableCell>
              <TableCell>{formatDate(prescription.end_date)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link to={`/prescriptions/${prescription.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link to={`/prescriptions/${prescription.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>

                  <DeleteBtn
                    resource="prescriptions"
                    id={prescription.id}
                    onDeleteCallback={onDeleteCallback}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
