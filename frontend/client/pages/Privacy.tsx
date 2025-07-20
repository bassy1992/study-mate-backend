import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Coming soon - Our privacy policy and data protection commitment.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
