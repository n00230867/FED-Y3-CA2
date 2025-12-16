import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconArrowLeft,
  IconEdit,
  IconClipboardList,
  IconCalendar,
  IconUser,
  IconMail,
  IconPhone,
  IconExternalLink,
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

export default function DiagnosesShow() {
  const [diagnosis, setDiagnosis] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
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
        toast.error("Failed to fetch diagnosis details");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id, token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!diagnosis || !patient) {
    return <p>Diagnosis not found</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/diagnoses")}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Diagnosis Details</h1>
          <p className="text-muted-foreground">View diagnosis information</p>
        </div>
        {token && (
          <Button variant="outline" onClick={() => navigate(`/diagnoses/${id}/edit`)}>
            <IconEdit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Diagnosis Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <IconClipboardList className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Diagnosis #{diagnosis.id}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {formatDate(diagnosis.diagnosis_date)}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center gap-4 p-5 rounded-lg bg-muted/50">
              <IconCalendar className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="font-semibold text-lg">{formatDate(diagnosis.diagnosis_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-lg bg-muted/50">
              <IconClipboardList className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Condition</p>
                <p className="font-semibold text-lg">{diagnosis.condition}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Information */}
      <div className="grid gap-6 md:grid-cols-2">
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
      </div>
    </div>
  );
}
