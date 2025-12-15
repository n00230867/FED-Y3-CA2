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

export default function DiagnosesCreate() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [diagnosis_date, setDiagnosisDate] = useState("");
    const [patient_id, setPatientId] = useState("");
    const [condition, setCondition] = useState("");
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("/patients");
                setPatients(response.data);
            } catch (err) {
                console.error("Failed to fetch patients:", err);
                toast.error("Failed to load patients");
            }
        };
        fetchPatients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isoDate = new Date(diagnosis_date).toISOString().split("T")[0];

        const data = {
            diagnosis_date: isoDate,
            patient_id: Number(patient_id),
            condition,
        };

        try {
            await axios.post("/diagnoses", data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Diagnosis created!");
            navigate("/diagnoses");
        } catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data?.message || "Failed to create diagnosis.");
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Create Diagnosis</h1>

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
                    <Label>Condition</Label>
                    <Input
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label>Diagnosis Date</Label>
                    <Input
                        type="date"
                        value={diagnosis_date}
                        onChange={(e) => setDiagnosisDate(e.target.value)}
                        required
                    />
                </div>

                <Button type="submit" className="w-full">
                    Create Diagnosis
                </Button>
            </form>
        </>
    );
}
