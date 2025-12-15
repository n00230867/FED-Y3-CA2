import { useState } from "react";
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

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialisation, setSpecialisation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      first_name,
      last_name,
      email,
      phone,
      specialisation,
    };

    try {
      const response = await axios.post("/doctors", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Doctor created successfully!");
      navigate("/doctors");

    } catch (err) {
      console.log("Doctor create error:", err.response?.data);
      toast.error("Validation failed: " + JSON.stringify(err.response?.data));
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Create Doctor</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label>First Name</Label>
          <Input
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Last Name</Label>
          <Input
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Specialisation</Label>
          <Select
            value={specialisation}
            onValueChange={setSpecialisation}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a specialisation" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Podiatrist">Podiatrist</SelectItem>
              <SelectItem value="Dermatologist">Dermatologist</SelectItem>
              <SelectItem value="Pediatrician">Pediatrician</SelectItem>
              <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
              <SelectItem value="General Practitioner">General Practitioner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Create Doctor
        </Button>
      </form>
    </>
  );
}
