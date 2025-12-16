import { useState, useEffect } from "react";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Convert dd/mm/yyyy or yyyy-mm-dd → yyyy-mm-dd
function normalizeDate(value) {
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    return `${year}-${month}-${day}`;
  }
  return value;
}

export default function PrescriptionsCreate() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [patient_id, setPatientId] = useState("");
  const [doctor_id, setDoctorId] = useState("");
  const [diagnosis_id, setDiagnosisId] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, diagnosesRes] = await Promise.all([
          axios.get("/patients"),
          axios.get("/doctors"),
          axios.get("/diagnoses"),
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
        setDiagnoses(diagnosesRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!patient_id) {
      toast.error("Please select a patient");
      return;
    }
    if (!doctor_id) {
      toast.error("Please select a doctor");
      return;
    }
    if (!diagnosis_id) {
      toast.error("Please select a diagnosis");
      return;
    }

    const formattedStartDate = normalizeDate(start_date);
    const formattedEndDate = normalizeDate(end_date);

    const data = {
      patient_id: parseInt(patient_id),
      doctor_id: parseInt(doctor_id),
      diagnosis_id: parseInt(diagnosis_id),
      medication,
      dosage,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    try {
      await axios.post("/prescriptions", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Prescription created successfully!");
      navigate("/prescriptions");
    } catch (err) {
      console.log("Prescription create error:", err.response?.data);
      toast.error("Validation failed: " + JSON.stringify(err.response?.data));
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Create Prescription</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label>Patient</Label>
          <Select value={patient_id} onValueChange={setPatientId} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={String(patient.id)}>
                  #{patient.id} - {patient.first_name} {patient.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Doctor</Label>
          <Select value={doctor_id} onValueChange={setDoctorId} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={String(doctor.id)}>
                  #{doctor.id} - {doctor.first_name} {doctor.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Diagnosis</Label>
          <Select value={diagnosis_id} onValueChange={setDiagnosisId} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a diagnosis" />
            </SelectTrigger>
            <SelectContent>
              {diagnoses.map((diagnosis) => (
                <SelectItem key={diagnosis.id} value={String(diagnosis.id)}>
                  #{diagnosis.id} - {diagnosis.condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Medication</Label>
          <Input
            required
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
          />
        </div>

        <div>
          <Label>Dosage</Label>
          <Input
            required
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>

        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            required
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            required
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Button type="submit">Create Prescription</Button>
      </form>
    </>
  );
}
