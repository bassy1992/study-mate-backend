import { useState } from 'react';
import { apiClient } from '@shared/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function RegistrationTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState({
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'testpassword123',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const registrationData = {
        email: testData.email,
        username: testData.email,
        first_name: testData.firstName,
        last_name: testData.lastName,
        password: testData.password,
        password_confirm: testData.password,
        phone_number: '',
      };

      console.log('Testing registration with:', registrationData);

      const response = await apiClient.register(registrationData);
      setResult(response);
      
      // Store token for testing
      localStorage.setItem('authToken', response.token);
      
    } catch (err: any) {
      console.error('Registration test error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await apiClient.login(testData.email, testData.password);
      setResult(response);
      
      // Store token for testing
      localStorage.setItem('authToken', response.token);
      
    } catch (err: any) {
      console.error('Login test error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testProfile = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await apiClient.getProfile();
      setResult(response);
    } catch (err: any) {
      console.error('Profile test error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('authToken');
    setResult(null);
    setError(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">User Registration & Authentication Test</h1>
      
      {/* Test Data Form */}
      <Card>
        <CardHeader>
          <CardTitle>Test User Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={testData.email}
                onChange={handleInputChange}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={testData.firstName}
                onChange={handleInputChange}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={testData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={testData.password}
                onChange={handleInputChange}
                placeholder="testpassword123"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={testRegistration} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test Registration
            </Button>
            
            <Button 
              onClick={testLogin} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test Login
            </Button>
            
            <Button 
              onClick={testProfile} 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test Get Profile
            </Button>
            
            <Button 
              onClick={clearToken} 
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Clear Token
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {(result || error) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {error ? (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Test Failed</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Test Successful</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">Error:</p>
                <pre className="text-red-600 text-sm mt-2 whitespace-pre-wrap">{error}</pre>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium">Response:</p>
                <pre className="text-green-600 text-sm mt-2 whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Token Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {localStorage.getItem('authToken') ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-700">Token stored in localStorage</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {localStorage.getItem('authToken')?.substring(0, 20)}...
                </code>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">No token found</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}