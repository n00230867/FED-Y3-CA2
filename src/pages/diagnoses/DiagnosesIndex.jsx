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
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get("/diagnoses");
        setDiagnoses(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch diagnoses");
      }
    };

    fetchDiagnoses();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Diagnosis deleted successfully");
    setDiagnoses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link to="/diagnoses/create">Create New Diagnosis</Link>
        </Button>
      )}

      <Table>
        <TableCaption>List of Diagnoses</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Diagnosis Date</TableHead>
            {token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {diagnoses.map((diagnosis) => (
            <TableRow key={diagnosis.id}>
              <TableCell>{diagnosis.patient_id}</TableCell>
              <TableCell>{diagnosis.condition}</TableCell>
              <TableCell>{formatDate(diagnosis.diagnosis_date)}</TableCell>

              {token && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
                    >
                      <Eye />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
                    >
                      <Pencil />
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
    </>
  );
}
