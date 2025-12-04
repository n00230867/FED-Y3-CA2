import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";

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

export default function PatientsIndex() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/patients");
        setPatients(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatients();
  }, []);

  const onDeleteCallback = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4">
          <Link to="/patients/create">Create Patient</Link>
        </Button>
      )}

      <Table>
        <TableCaption>List of patients.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date of Birth</TableHead>
            {token && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.first_name}</TableCell>
              <TableCell>{patient.last_name}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.phone}</TableCell>

              {/* Format date as dd/mm/yyyy */}
              <TableCell>{formatDate(patient.date_of_birth)}</TableCell>

              {token && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      <Eye />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        navigate(`/patients/${patient.id}/edit`)
                      }
                    >
                      <Pencil />
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
    </>
  );
}
