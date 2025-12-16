import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";

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
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Welcome to Medical Clinic</h1>
                        <p className="text-muted-foreground">Use the sidebar to navigate</p>
                    </div>
                )}
            </div>
        </>
    );
};