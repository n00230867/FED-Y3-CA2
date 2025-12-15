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

export default function AppointmentsCreate() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [appointment_date, setAppointmentDate] = useState("");
    const [doctor_id, setDoctorId] = useState("");
    const [patient_id, setPatientId] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsRes, patientsRes] = await Promise.all([
                    axios.get("/doctors"),
                    axios.get("/patients")
                ]);
                setDoctors(doctorsRes.data);
                setPatients(patientsRes.data);
            } catch (err) {
                console.error("Failed to fetch doctors/patients:", err);
                toast.error("Failed to load doctors or patients");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
  e.preventDefault();

  // Force yyyy-mm-dd ISO format
  const isoDate = new Date(appointment_date).toISOString().split("T")[0];

  const data = {
    appointment_date: isoDate,
    doctor_id: Number(doctor_id),
    patient_id: Number(patient_id),
  };

  try {
    await axios.post("/appointments", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Appointment created!");
    navigate("/appointments");
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message || "Failed to create appointment.");
  }
};


    return (
        <>
        <h1 className="text-2xl font-bold mb-4">Create Appointment</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
            <Label>Appointment Date</Label>
            <Input
                type="date"
                value={appointment_date}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
            />
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
                            #{doctor.id} - Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialisation}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            </div>

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

            <Button type="submit" className="w-full">
            Create Appointment
            </Button>
        </form>
        </>
    );
}
