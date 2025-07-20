import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Lock,
  Download,
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle,
  Calendar,
} from "lucide-react";

export default function Profile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Akosua Mensah",
    email: "akosua.mensah@gmail.com",
    phone: "+233 XX XXX XXXX",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password changed:", passwordData);
  };

  const purchaseHistory = [
    {
      id: "INV-001",
      bundle: "JHS 2 Bundle",
      subjects: "English, Math, Science",
      amount: "$15.00",
      date: "2024-01-15",
      status: "Completed",
      paymentMethod: "MTN Mobile Money",
    },
    {
      id: "INV-002",
      bundle: "JHS 1 Bundle",
      subjects: "English, Math, Science",
      amount: "$15.00",
      date: "2023-12-10",
      status: "Completed",
      paymentMethod: "Vodafone Cash",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-gold" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.fullName}
                </h1>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="bg-white rounded-2xl shadow-lg border p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-gray-600">
                        Update your personal details and contact information.
                      </p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <div className="relative">
                            <Input
                              id="fullName"
                              name="fullName"
                              type="text"
                              value={profileData.fullName}
                              onChange={handleProfileChange}
                              className="h-12 pl-12"
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              className="h-12 pl-12"
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            placeholder="+233 XX XXX XXXX"
                            className="h-12 pl-12"
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">
                          Used for Mobile Money payments and notifications
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="bg-gold hover:bg-gold/90 text-white"
                      >
                        Save Changes
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="bg-white rounded-2xl shadow-lg border p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Change Password
                      </h2>
                      <p className="text-gray-600">
                        Update your password to keep your account secure.
                      </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your current password"
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your new password"
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm your new password"
                          className="h-12"
                        />
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gold/5 p-4 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-gold" />
                        <span>
                          Password must be at least 8 characters long and
                          contain uppercase, lowercase, and numbers
                        </span>
                      </div>

                      <Button
                        type="submit"
                        className="bg-gold hover:bg-gold/90 text-white"
                      >
                        Update Password
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing">
                <div className="space-y-6">
                  {/* Current Subscriptions */}
                  <div className="bg-white rounded-2xl shadow-lg border p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Active Subscriptions
                        </h2>
                        <p className="text-gray-600">
                          Manage your current course bundles.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-gray-900">
                                JHS 2 Bundle
                              </h3>
                              <p className="text-sm text-gray-600">
                                English, Mathematics, Science
                              </p>
                              <p className="text-xs text-gray-500">
                                Expires: March 15, 2024
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gold">
                                $15.00
                              </div>
                              <span className="bg-emerald/10 text-emerald px-2 py-1 rounded-full text-xs font-medium">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" asChild>
                        <Link to="/bundles">Purchase More Bundles</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Purchase History */}
                  <div className="bg-white rounded-2xl shadow-lg border p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Purchase History
                        </h2>
                        <p className="text-gray-600">
                          View and download your payment receipts.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {purchaseHistory.map((purchase) => (
                          <div
                            key={purchase.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-4">
                                  <h3 className="font-semibold text-gray-900">
                                    {purchase.bundle}
                                  </h3>
                                  <span className="bg-emerald/10 text-emerald px-2 py-1 rounded-full text-xs font-medium">
                                    {purchase.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {purchase.subjects}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{purchase.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <CreditCard className="h-3 w-3" />
                                    <span>{purchase.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <div className="text-lg font-bold text-gray-900">
                                  {purchase.amount}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Receipt
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {purchaseHistory.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-600">
                            No purchase history available.
                          </p>
                          <Button className="mt-4" asChild>
                            <Link to="/bundles">
                              Purchase Your First Bundle
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
