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

// Format date_of_birth as dd/mm/yyyy
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

export default function PatientsShow() {
  const [patient, setPatient] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatient(response.data);
      } catch (err) {
        console.error("ERROR FETCHING PATIENT:", err.response?.data);
      }
    };

    fetchPatient();
  }, [id, token]);

  if (!patient) {
    return <p>Loading patient...</p>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {patient.first_name} {patient.last_name}
        </CardTitle>

        <CardDescription>
          Date of Birth: {formatDate(patient.date_of_birth)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Phone:</strong> {patient.phone}</p>
        <p><strong>Address:</strong> {patient.address}</p>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
