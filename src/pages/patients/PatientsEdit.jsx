import { useState, useEffect } from "react";
import axios from "@/config/api";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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

export default function PatientsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [patient, setPatient] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await axios.get(`/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                });

                const p = response.data;

                setPatient({
                first_name: p.first_name,
                last_name: p.last_name,
                email: p.email,
                phone: p.phone,
                address: p.address,
                date_of_birth: formatDateForInput(p.date_of_birth),
                });
            } catch (err) {
                console.error("FAILED TO LOAD PATIENT:", err.response?.data);
                toast.error("Could not load patient.");
            }
        };

    fetchPatient();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedPatient = {
        ...patient,
        date_of_birth: patient.date_of_birth, // send as yyyy-mm-dd string
        };

        try {
        await axios.patch(`/patients/${id}`, updatedPatient, {
            headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Patient updated successfully!");
        navigate("/patients");
        } catch (err) {
        console.error("UPDATE FAILED:", err.response?.data);
        toast.error("Validation error — check fields.");
        }
    };

    return (
        <>
        <h1 className="text-2xl font-bold mb-4">Edit Patient</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
            <Label>First Name</Label>
            <Input
                value={patient.first_name}
                onChange={(e) =>
                setPatient({ ...patient, first_name: e.target.value })
                }
                required
            />
            </div>

            <div>
            <Label>Last Name</Label>
            <Input
                value={patient.last_name}
                onChange={(e) =>
                setPatient({ ...patient, last_name: e.target.value })
                }
                required
            />
            </div>

            <div>
            <Label>Email</Label>
            <Input
                type="email"
                value={patient.email}
                onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                required
            />
            </div>

            <div>
            <Label>Phone</Label>
            <Input
                value={patient.phone}
                onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                required
            />
            </div>

            <div>
            <Label>Date of Birth</Label>
            <Input
                type="date"
                value={patient.date_of_birth}
                onChange={(e) =>
                setPatient({ ...patient, date_of_birth: e.target.value })
                }
                required
            />
            </div>

            <div>
            <Label>Address</Label>
            <Input
                value={patient.address}
                onChange={(e) =>
                setPatient({ ...patient, address: e.target.value })
                }
                required
            />
            </div>

            <Button type="submit" className="w-full">
            Save Changes
            </Button>
        </form>
        </>
    );
}
