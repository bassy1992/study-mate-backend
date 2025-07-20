import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Home, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <BookOpen className="h-24 w-24 text-gold mx-auto" />
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. Let's get you
              back to learning!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-gold hover:bg-gold/90 text-white"
              size="lg"
              asChild
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/bundles">View Course Bundles</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
