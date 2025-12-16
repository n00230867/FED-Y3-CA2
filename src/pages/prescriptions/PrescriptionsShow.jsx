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

// Format date as dd/mm/yyyy
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

export default function PrescriptionsShow() {
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`/prescriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const prescriptionData = response.data;
        setPrescription(prescriptionData);

        const [patientRes, doctorRes, diagnosisRes] = await Promise.all([
          axios.get(`/patients/${prescriptionData.patient_id}`),
          axios.get(`/doctors/${prescriptionData.doctor_id}`),
          axios.get(`/diagnoses/${prescriptionData.diagnosis_id}`),
        ]);

        setPatient(patientRes.data);
        setDoctor(doctorRes.data);
        setDiagnosis(diagnosisRes.data);
      } catch (err) {
        console.error("ERROR FETCHING PRESCRIPTION:", err.response?.data);
      }
    };

    fetchPrescription();
  }, [id, token]);

  if (!prescription || !patient || !doctor || !diagnosis) {
    return <p>Loading prescription...</p>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Prescription #{prescription.id}</CardTitle>

        <CardDescription>
          {prescription.medication} - {prescription.dosage}
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
          <h3 className="font-semibold text-lg mb-2">Doctor Information</h3>
          <p><strong>Name:</strong> Dr. {doctor.first_name} {doctor.last_name}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Diagnosis</h3>
          <p><strong>Condition:</strong> {diagnosis.condition}</p>
          <p><strong>Diagnosis Date:</strong> {formatDate(diagnosis.diagnosis_date)}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Prescription Details</h3>
          <p><strong>Medication:</strong> {prescription.medication}</p>
          <p><strong>Dosage:</strong> {prescription.dosage}</p>
          <p><strong>Start Date:</strong> {formatDate(prescription.start_date)}</p>
          <p><strong>End Date:</strong> {formatDate(prescription.end_date)}</p>
        </div>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
