
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/logo';
import { 
  Home, 
  Calendar, 
  Dumbbell, 
  BarChart, 
  Droplet, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  label: string;
  icon: React.ElementType;
  to: string;
}

interface NavigationProps {
  activeRoute?: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeRoute }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Use the prop if provided, otherwise fallback to the location
  const currentRoute = activeRoute || location.pathname.substring(1) || 'dashboard';
  
  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: Home, to: '/' },
    { label: 'Meal Planner', icon: Calendar, to: '/meals' },
    { label: 'Exercises', icon: Dumbbell, to: '/exercises' },
    { label: 'Progress', icon: BarChart, to: '/progress' },
    { label: 'Water Tracker', icon: Droplet, to: '/water' },
    { label: 'Profile', icon: User, to: '/profile' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-regime-dark z-50 flex items-center justify-between px-4 shadow-md">
          <Logo size="sm" />
          <button 
            onClick={toggleMobileMenu}
            className="text-white p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
        
        {/* Mobile Menu */}
        <div 
          className={cn(
            "fixed inset-0 z-40 bg-regime-dark transition-all duration-300 ease-in-out transform",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          style={{ top: '64px' }}
        >
          <nav className="flex flex-col p-6 space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center text-lg font-medium py-3 px-4 rounded-lg transition-colors",
                  (item.to === '/' ? currentRoute === 'dashboard' : item.to.substring(1) === currentRoute)
                    ? "bg-regime-green text-regime-dark" 
                    : "text-white hover:bg-white/10"
                )}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-regime-dark z-30 flex items-center justify-around px-2 shadow-lg">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center p-2 flex-1",
                (item.to === '/' ? currentRoute === 'dashboard' : item.to.substring(1) === currentRoute)
                  ? "text-regime-green" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Space for bottom navigation */}
        <div className="h-16" />
      </>
    );
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-regime-dark text-white shadow-xl z-50">
      <div className="p-6">
        <Logo />
      </div>
      <nav className="mt-6 px-4">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center text-sm font-medium py-3 px-4 rounded-lg transition-colors mb-2",
              (item.to === '/' ? currentRoute === 'dashboard' : item.to.substring(1) === currentRoute)
                ? "bg-regime-green text-regime-dark" 
                : "text-white hover:bg-white/10"
            )}
          >
            <item.icon size={18} className="mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="p-4 rounded-lg bg-white/10">
          <p className="text-sm text-white/80">Connect your fitness device for enhanced tracking</p>
          <button className="mt-3 w-full btn-regime text-sm py-2">Connect Device</button>
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
