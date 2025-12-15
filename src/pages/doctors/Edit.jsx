import { useState, useEffect } from "react";
import axios from "@/config/api";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialisation, setSpecialisation] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setSpecialisation(response.data.specialisation);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load doctor details");
      }
    };

    fetchDoctor();
  }, [id, token]);

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
      await axios.patch(`/doctors/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Doctor updated successfully!");
      navigate(`/doctors/${id}`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update doctor");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Edit Doctor</h1>

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
          <Input
            value={specialisation}
            onChange={(e) => setSpecialisation(e.target.value)}
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
