import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Show() {
  const [doctor, setDoctor] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDoctor = async () => {
      console.log("Fetching doctor with ID:", id);

      try {
        const response = await axios.get(`/doctors/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);
        setDoctor(response.data);
      } catch (err) {
        console.error("ERROR FETCHING DOCTOR:", err.response?.data);
      }
    };

    fetchDoctor();
  }, [id, token]);

  if (!doctor) {
    return <p>Loading doctor...</p>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {doctor.first_name} {doctor.last_name}
        </CardTitle>
        <CardDescription>
          Specialisation: {doctor.specialisation}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Phone:</strong> {doctor.phone}</p>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
