import { Home, Utensils, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleAuthAction = async () => {
    if (session) {
      await signOut();
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-1 ${
            isActive("/") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link 
          to="/custom-diet" 
          className={`flex flex-col items-center gap-1 ${
            isActive("/custom-diet") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Utensils size={24} />
          <span className="text-xs">Custom Diet</span>
        </Link>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 h-auto py-0"
          onClick={handleAuthAction}
        >
          {session ? (
            <>
              <LogOut size={24} />
              <span className="text-xs">Sign Out</span>
            </>
          ) : (
            <>
              <LogIn size={24} />
              <span className="text-xs">Sign In</span>
            </>
          )}
        </Button>
      </div>
    </nav>
  );
};