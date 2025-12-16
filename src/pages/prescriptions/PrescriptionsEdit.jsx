import { useState, useEffect } from "react";
import axios from "@/config/api";
import { useNavigate, useParams } from "react-router";
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

// Convert timestamp → yyyy-mm-dd for <input type="date">
function formatDateForInput(timestamp) {
  if (!timestamp) return "";

  const ms = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  const d = new Date(ms);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export default function PrescriptionsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [prescription, setPrescription] = useState({
    patient_id: "",
    doctor_id: "",
    diagnosis_id: "",
    medication: "",
    dosage: "",
    start_date: "",
    end_date: "",
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionRes, patientsRes, doctorsRes, diagnosesRes] = await Promise.all([
          axios.get(`/prescriptions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/patients"),
          axios.get("/doctors"),
          axios.get("/diagnoses"),
        ]);

        const p = prescriptionRes.data;

        setPrescription({
          patient_id: String(p.patient_id),
          doctor_id: String(p.doctor_id),
          diagnosis_id: String(p.diagnosis_id),
          medication: p.medication,
          dosage: p.dosage,
          start_date: formatDateForInput(p.start_date),
          end_date: formatDateForInput(p.end_date),
        });

        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
        setDiagnoses(diagnosesRes.data);
      } catch (err) {
        console.error("FAILED TO LOAD DATA:", err.response?.data);
        toast.error("Could not load data.");
      }
    };

    fetchData();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPrescription = {
      patient_id: parseInt(prescription.patient_id),
      doctor_id: parseInt(prescription.doctor_id),
      diagnosis_id: parseInt(prescription.diagnosis_id),
      medication: prescription.medication,
      dosage: prescription.dosage,
      start_date: prescription.start_date, // send as yyyy-mm-dd string
      end_date: prescription.end_date, // send as yyyy-mm-dd string
    };

    try {
      await axios.patch(`/prescriptions/${id}`, updatedPrescription, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });

      toast.success("Prescription updated successfully!");
      navigate("/prescriptions");
    } catch (err) {
      console.error("UPDATE FAILED:", err.response?.data);
      toast.error("Update failed: " + (err.response?.data?.message || JSON.stringify(err.response?.data)));
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Edit Prescription</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        <div>
          <Label>Patient</Label>
          <Select 
            value={prescription.patient_id} 
            onValueChange={(value) => setPrescription({ ...prescription, patient_id: value })}
            required
          >
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
          <Select 
            value={prescription.doctor_id} 
            onValueChange={(value) => setPrescription({ ...prescription, doctor_id: value })}
            required
          >
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
          <Select 
            value={prescription.diagnosis_id} 
            onValueChange={(value) => setPrescription({ ...prescription, diagnosis_id: value })}
            required
          >
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
            value={prescription.medication}
            onChange={(e) =>
              setPrescription({ ...prescription, medication: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Dosage</Label>
          <Input
            required
            value={prescription.dosage}
            onChange={(e) =>
              setPrescription({ ...prescription, dosage: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            required
            value={prescription.start_date}
            onChange={(e) =>
              setPrescription({ ...prescription, start_date: e.target.value })
            }
          />
        </div>

        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            required
            value={prescription.end_date}
            onChange={(e) =>
              setPrescription({ ...prescription, end_date: e.target.value })
            }
          />
        </div>

        <Button type="submit">Update Prescription</Button>
      </form>
    </>
  );
}
