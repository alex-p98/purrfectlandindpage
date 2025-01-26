import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-16 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <img
            src="/lovable-uploads/7b67eb30-d42a-40a0-b139-af164902e1fb.png"
            alt="PurrfectDiet Logo"
            className="h-12"
          />
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            className="w-full h-12"
          />
          <Input
            type="password"
            placeholder="Password"
            className="w-full h-12"
          />
          <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </div>

        <div className="text-center">
          <Link 
            to="/signup" 
            className="text-primary hover:underline text-lg"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;