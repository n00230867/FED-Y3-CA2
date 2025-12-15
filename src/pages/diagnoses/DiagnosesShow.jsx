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

export default function DiagnosesShow() {
  const [diagnosis, setDiagnosis] = useState(null);
  const [patient, setPatient] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(`/diagnoses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const diagnosisData = response.data;
        setDiagnosis(diagnosisData);

        const patientRes = await axios.get(`/patients/${diagnosisData.patient_id}`);
        setPatient(patientRes.data);
      } catch (err) {
        console.error("ERROR FETCHING DIAGNOSIS:", err.response?.data);
      }
    };

    fetchDiagnosis();
  }, [id, token]);

  if (!diagnosis || !patient) {
    return <p>Loading diagnosis...</p>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Diagnosis #{diagnosis.id}
        </CardTitle>

        <CardDescription>
          Diagnosed on {formatDate(diagnosis.diagnosis_date)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Patient Information</h3>
          <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Diagnosis Details</h3>
          <p><strong>Condition:</strong> {diagnosis.condition}</p>
        </div>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
