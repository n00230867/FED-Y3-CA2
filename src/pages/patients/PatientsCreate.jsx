import { useState } from "react";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Convert dd/mm/yyyy or yyyy-mm-dd → yyyy-mm-dd
function normalizeDate(value) {
  // If user types dd/mm/yyyy
    if (value.includes("/")) {
        const [day, month, year] = value.split("/");
        return `${year}-${month}-${day}`; // Convert to yyyy-mm-dd (string)
    }

  // If already yyyy-mm-dd
    return value;
}

export default function PatientsCreate() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [date_of_birth, setDateOfBirth] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

    const formattedDate = normalizeDate(date_of_birth);

    const data = {
        first_name,
        last_name,
        email,
        phone,
        address,
        date_of_birth: formattedDate, // MUST be a string yyyy-mm-dd
    };

    try {
        const response = await axios.post("/patients", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        toast.success("Patient created successfully!");
        navigate("/patients");

    } catch (err) {
        console.log("Patient create error:", err.response?.data);
        toast.error("Validation failed: " + JSON.stringify(err.response?.data));
    }
};

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Create Patient</h1>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

            <div>
                <Label>First Name</Label>
                <Input value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
            </div>

            <div>
                <Label>Last Name</Label>
                <Input value={last_name} onChange={(e) => setLastName(e.target.value)} required />
            </div>

            <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div>
            <Label>Date of Birth</Label>
            <Input
                type="text"
                placeholder="dd/mm/yyyy or yyyy-mm-dd"
                value={date_of_birth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
            />
            </div>

            <div>
                <Label>Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full">Create Patient</Button>
        </form>
        </>
    );
}
