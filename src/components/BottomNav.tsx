import { Home, Utensils, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

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
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center gap-1 ${
            isActive("/profile") ? "text-primary" : "text-gray-500"
          }`}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
};