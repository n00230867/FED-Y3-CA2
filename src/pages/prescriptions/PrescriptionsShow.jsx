import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconPill,
  IconUser,
  IconStethoscope,
  IconClipboardList,
  IconCalendar,
  IconArrowLeft,
  IconEdit,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescription = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id, token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!prescription || !patient || !doctor || !diagnosis) {
    return <p>Prescription not found</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/prescriptions")}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Prescription Details</h1>
          <p className="text-muted-foreground">View prescription and related information</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/prescriptions/${id}/edit`)}>
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Prescription Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <IconPill className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {prescription.medication}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  <Badge variant="secondary" className="mt-1">
                    {prescription.dosage}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IconCalendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(prescription.start_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IconCalendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(prescription.end_date)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Information Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <IconUser className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Associated patient details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-semibold text-lg">
                  {patient.first_name} {patient.last_name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                View Patient
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                <IconStethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Doctor Information</CardTitle>
                <CardDescription>Prescribing physician</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-semibold text-lg">
                  Dr. {doctor.first_name} {doctor.last_name}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {doctor.specialisation}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.phone}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              >
                View Doctor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                <IconClipboardList className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Diagnosis Information</CardTitle>
                <CardDescription>Related medical condition</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Condition</p>
                <p className="font-semibold text-lg">{diagnosis.condition}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Diagnosis Date</p>
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(diagnosis.diagnosis_date)}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
              >
                View Diagnosis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
