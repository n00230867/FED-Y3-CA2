import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";

export default function Index() {
  const [doctors, setDoctors] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/doctors");
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Doctor deleted successfully");
    setDoctors(doctors.filter((doctor) => doctor.id !== id));
  };

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link to={`/doctors/create`}>Create New Doctor</Link>
        </Button>
      )}

      <Table>
        <TableCaption>List of Doctors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Specialisation</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            {token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>
                {doctor.first_name} {doctor.last_name}
              </TableCell>
              <TableCell>{doctor.specialisation}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.phone}</TableCell>

              {token && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/doctors/${doctor.id}`)}
                    >
                      <Eye />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                    >
                      <Pencil />
                    </Button>

                    <DeleteBtn
                      resource="doctors"
                      id={doctor.id}
                      onDeleteCallback={onDeleteCallback}
                    />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
