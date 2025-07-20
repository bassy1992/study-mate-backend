import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@shared/api';

export function AuthDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const profile = await apiClient.getProfile();
      const purchases = await apiClient.getUserPurchases();
      
      setDebugInfo({
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        hasToken: !!token,
        profile: profile,
        purchases: purchases.results,
        purchaseCount: purchases.count
      });
    } catch (error: any) {
      setDebugInfo({
        token: localStorage.getItem('authToken') ? 'Token exists but invalid' : 'No token',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testBundleSubjects = async () => {
    try {
      const purchases = await apiClient.getUserPurchases();
      if (purchases.results.length > 0) {
        const bundleId = purchases.results[0].bundle.id;
        console.log('Testing bundle subjects for bundle ID:', bundleId);
        const subjects = await apiClient.getBundleSubjects(bundleId);
        console.log('Bundle subjects response:', subjects);
        alert(`Found ${subjects.subjects.length} subjects in bundle`);
      } else {
        alert('No purchases found');
      }
    } catch (error: any) {
      console.error('Bundle subjects test failed:', error);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Authentication Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : debugInfo ? (
          <div className="space-y-2">
            <p><strong>Token:</strong> {debugInfo.token}</p>
            <p><strong>Has Token:</strong> {debugInfo.hasToken ? 'Yes' : 'No'}</p>
            {debugInfo.profile && (
              <>
                <p><strong>User:</strong> {debugInfo.profile.email}</p>
                <p><strong>Name:</strong> {debugInfo.profile.first_name} {debugInfo.profile.last_name}</p>
              </>
            )}
            <p><strong>Purchases:</strong> {debugInfo.purchaseCount || 0}</p>
            {debugInfo.purchases && debugInfo.purchases.map((purchase: any) => (
              <div key={purchase.id} className="ml-4">
                <p>- Bundle: {purchase.bundle.title} (ID: {purchase.bundle.id})</p>
              </div>
            ))}
            {debugInfo.error && (
              <p className="text-red-600"><strong>Error:</strong> {debugInfo.error}</p>
            )}
          </div>
        ) : (
          <p>No debug info available</p>
        )}
        
        <div className="mt-4 space-x-2">
          <Button onClick={checkAuth} size="sm">Refresh</Button>
          <Button onClick={testBundleSubjects} size="sm" variant="outline">
            Test Bundle Subjects
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}