import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { 
    IconUsers, 
    IconStethoscope, 
    IconCalendar, 
    IconPill,
    IconClipboardList,
    IconArrowRight
} from "@tabler/icons-react";

export default function Home() {
    const { token } = useAuth();
    return (
        <>
            <div className="flex items-center justify-center min-h-[80vh]">
                {!token ? (
                    <div className="flex flex-col gap-4 items-center">
                        <LoginForm />
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Button variant="link" className="p-0" asChild>
                                <Link to="/register">Create account</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-5xl mx-auto px-4">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-2">Welcome to Medical Clinic</h1>
                            <p className="text-muted-foreground text-lg">Quick access to all sections</p>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                                <Link to="/patients" className="block">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <IconUsers className="h-8 w-8 text-blue-500" />
                                            <IconArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <CardTitle className="mt-4">Patients</CardTitle>
                                        <CardDescription>Manage patient records and information</CardDescription>
                                    </CardHeader>
                                </Link>
                            </Card>

                            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                                <Link to="/doctors" className="block">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <IconStethoscope className="h-8 w-8 text-green-500" />
                                            <IconArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <CardTitle className="mt-4">Doctors</CardTitle>
                                        <CardDescription>View and manage doctor profiles</CardDescription>
                                    </CardHeader>
                                </Link>
                            </Card>

                            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                                <Link to="/appointments" className="block">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <IconCalendar className="h-8 w-8 text-purple-500" />
                                            <IconArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <CardTitle className="mt-4">Appointments</CardTitle>
                                        <CardDescription>Schedule and manage appointments</CardDescription>
                                    </CardHeader>
                                </Link>
                            </Card>

                            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                                <Link to="/prescriptions" className="block">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <IconPill className="h-8 w-8 text-orange-500" />
                                            <IconArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <CardTitle className="mt-4">Prescriptions</CardTitle>
                                        <CardDescription>Create and track prescriptions</CardDescription>
                                    </CardHeader>
                                </Link>
                            </Card>

                            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                                <Link to="/diagnoses" className="block">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <IconClipboardList className="h-8 w-8 text-red-500" />
                                            <IconArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <CardTitle className="mt-4">Diagnoses</CardTitle>
                                        <CardDescription>Record and review diagnoses</CardDescription>
                                    </CardHeader>
                                </Link>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};