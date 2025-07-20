import { Link } from "react-router-dom";
import { BookOpen, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F261a98e6df434ad1ad15c1896e5c6aa3%2F0ae20864790b43468f9946c41689e590?format=webp&width=800"
                alt="StudyMate Logo"
                className="h-14 w-auto drop-shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white leading-tight">
                  StudyMate
                </span>
                <span className="text-lg text-blue-400 font-medium -mt-1">
                  Your Learning Partner
                </span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering JHS students across Ghana with comprehensive education
              and BECE preparation designed for academic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-6">Quick Links</h3>
            <div className="space-y-2">
              <Link
                to="/bundles"
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                Course Bundles
              </Link>
              <Link
                to="/about"
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                About Us
              </Link>
              <Link
                to="/how-it-works"
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                How It Works
              </Link>
              <Link
                to="/faq"
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-bold text-lg text-white mb-6">Subjects</h3>
            <div className="space-y-2">
              <div className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                English Language
              </div>
              <div className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                Mathematics
              </div>
              <div className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                Integrated Science
              </div>
              <div className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                Social Studies
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg text-white mb-6">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                <Phone className="h-5 w-5" />
                <span>+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                <Mail className="h-5 w-5" />
                <span>info@studymate.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                <MapPin className="h-5 w-5" />
                <span>Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">
            © 2024 StudyMate. Proudly Ghanaian. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
