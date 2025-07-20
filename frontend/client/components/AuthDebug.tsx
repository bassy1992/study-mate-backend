import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useApi';
import { apiClient } from '@shared/api';

export function AuthDebug() {
  const { user, isAuthenticated, loading } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const testAuth = async () => {
    const token = localStorage.getItem('authToken');
    setTestResult(`Token in localStorage: ${token ? 'Yes' : 'No'}\nToken: ${token || 'None'}`);
  };

  const testApiCall = async () => {
    try {
      const response = await apiClient.getUserPurchases();
      setTestResult(`API Call Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      setTestResult(`API Call Error: ${error.message}`);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('authToken');
    setTestResult('Token cleared');
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Auth State:</h3>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? user.email : 'None'}</p>
        </div>

        <div className="flex space-x-2">
          <Button onClick={testAuth}>Check Token</Button>
          <Button onClick={testApiCall}>Test API Call</Button>
          <Button onClick={clearToken} className="bg-red-600 hover:bg-red-700 text-white">
            Clear Token
          </Button>
        </div>

        {testResult && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Test Result:</h4>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}