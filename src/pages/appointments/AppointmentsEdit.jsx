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

export default function AppointmentsEdit() {
    const { id } = useParams();
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
                const [appointmentRes, doctorsRes, patientsRes] = await Promise.all([
                    axios.get(`/appointments/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("/doctors"),
                    axios.get("/patients")
                ]);

                const a = appointmentRes.data;

                // Convert timestamp to yyyy-mm-dd for date input
                const date = new Date(a.appointment_date);
                const formattedDate = date.toISOString().split("T")[0];

                setAppointmentDate(formattedDate);
                setDoctorId(String(a.doctor_id));
                setPatientId(String(a.patient_id));
                setDoctors(doctorsRes.data);
                setPatients(patientsRes.data);
            } catch (err) {
                console.error("FAILED TO LOAD DATA:", err.response?.data);
                toast.error("Could not load appointment data.");
            }
        };

        fetchData();
    }, [id, token]);

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
            await axios.patch(`/appointments/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Appointment updated successfully!");
            navigate("/appointments");
        } catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data?.message || "Failed to update appointment.");
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Edit Appointment</h1>

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
                    Save Changes
                </Button>
            </form>
        </>
    );
}
