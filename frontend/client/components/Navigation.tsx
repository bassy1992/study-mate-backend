import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useUserPurchases } from "@/hooks/useApi";
import { toast } from "sonner";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  // Check if user has BECE bundle
  const { data: purchasesData } = useUserPurchases();
  const hasBECEBundle = purchasesData?.results?.some(
    purchase => purchase.bundle.bundle_type === 'bece_prep' && purchase.is_active
  ) || false;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F261a98e6df434ad1ad15c1896e5c6aa3%2F0ae20864790b43468f9946c41689e590?format=webp&width=800"
                  alt="StudyMate Logo"
                  className="h-14 w-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight tracking-tight">
                  StudyMate
                </span>
                <span className="text-sm font-semibold text-blue-400 -mt-1 tracking-wider">
                  Your Learning Partner
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <Link
                to="/"
                className="text-gray-300 hover:text-blue-400 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-blue-500/10 relative group"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/bundles"
                className="text-gray-300 hover:text-blue-400 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-blue-500/10 relative group"
              >
                <span className="relative z-10">Courses</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-blue-400 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-blue-500/10 relative group"
                  >
                    <span className="relative z-10">About</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="text-gray-300 hover:text-blue-400 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-blue-500/10 relative group"
                  >
                    <span className="relative z-10">How It Works</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/faq"
                    className="text-gray-300 hover:text-blue-400 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-blue-500/10 relative group"
                  >
                    <span className="relative z-10">Support</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {loading ? (
                <div className="text-gray-400 text-sm">Loading...</div>
              ) : isAuthenticated && user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {user.first_name || user.email}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 font-semibold border-2 border-transparent hover:border-blue-400/30 rounded-xl px-4 py-2 transition-all duration-300"
                      asChild
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    {hasBECEBundle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 font-semibold border-2 border-transparent hover:border-blue-400/30 rounded-xl px-4 py-2 transition-all duration-300"
                        asChild
                      >
                        <Link to="/bece-dashboard">
                          <Target className="h-4 w-4 mr-2" />
                          BECE Dashboard
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 font-semibold border-2 border-transparent hover:border-red-400/30 rounded-xl px-4 py-2 transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 font-semibold border-2 border-transparent hover:border-blue-400/30 rounded-xl px-6 py-2 transition-all duration-300"
                    asChild
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    className="btn-professional bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl font-semibold border-0 rounded-xl px-6 py-2"
                    size="sm"
                    asChild
                  >
                    <Link to="/signup">
                      <span>Get Started</span>
                      <div className="ml-2 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-800 hover:bg-gray-700 inline-flex items-center justify-center p-3 rounded-xl text-gray-300 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="mx-4 mb-4 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="px-4 py-6 space-y-2">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/bundles"
                  className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/about"
                      className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      to="/how-it-works"
                      className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      How It Works
                    </Link>
                    <Link
                      to="/faq"
                      className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Support
                    </Link>
                  </>
                )}
              </div>
              <div className="border-t border-gray-700 px-4 py-6 bg-gray-900">
                {loading ? (
                  <div className="text-gray-400 text-center text-sm">Loading...</div>
                ) : isAuthenticated && user ? (
                  <div className="flex flex-col space-y-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-2 text-gray-300 px-4 py-2">
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {user.first_name || user.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-gray-300 border-2 border-gray-600 hover:border-blue-400 hover:text-blue-400 font-semibold rounded-xl py-3"
                      asChild
                    >
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    {hasBECEBundle && (
                      <Button
                        variant="outline"
                        className="w-full text-gray-300 border-2 border-gray-600 hover:border-blue-400 hover:text-blue-400 font-semibold rounded-xl py-3"
                        asChild
                      >
                        <Link to="/bece-dashboard" onClick={() => setIsMenuOpen(false)}>
                          <Target className="h-4 w-4 mr-2" />
                          BECE Dashboard
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full text-gray-300 border-2 border-red-600 hover:border-red-400 hover:text-red-400 font-semibold rounded-xl py-3"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Button
                      variant="outline"
                      className="w-full text-gray-300 border-2 border-gray-600 hover:border-blue-400 hover:text-blue-400 font-semibold rounded-xl py-3"
                      asChild
                    >
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      className="btn-professional bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white w-full font-semibold shadow-lg rounded-xl py-3"
                      asChild
                    >
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
