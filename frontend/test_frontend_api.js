// Simple test to verify frontend API calls work
const API_BASE_URL = 'http://127.0.0.1:8000';

async function testFrontendAPI() {
  console.log('=== Testing Frontend API Calls ===');
  
  try {
    // Test user purchases endpoint
    console.log('Testing user purchases endpoint...');
    const response = await fetch(`${API_BASE_URL}/api/ecommerce/purchases/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token your-token-here', // You'll need to replace this
      },
      credentials: 'include',
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Purchases data:', data);
      
      // Test bundle subjects for each purchase
      if (data.results && data.results.length > 0) {
        for (const purchase of data.results) {
          if (purchase.bundle.bundle_type !== 'bece_prep') {
            console.log(`\nTesting bundle subjects for: ${purchase.bundle.title} (ID: ${purchase.bundle.id})`);
            
            const subjectsResponse = await fetch(`${API_BASE_URL}/api/ecommerce/bundles/${purchase.bundle.id}/subjects/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token your-token-here',
              },
              credentials: 'include',
            });
            
            console.log('Subjects response status:', subjectsResponse.status);
            
            if (subjectsResponse.ok) {
              const subjectsData = await subjectsResponse.json();
              console.log('Subjects data:', subjectsData);
            } else {
              console.error('Failed to fetch subjects:', await subjectsResponse.text());
            }
          }
        }
      }
    } else {
      console.error('Failed to fetch purchases:', await response.text());
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Note: This is just a template - you'll need to run this in the browser console
// with a valid authentication token
console.log('To test the API:');
console.log('1. Open the browser developer tools');
console.log('2. Go to the Network tab to see API calls');
console.log('3. Navigate to http://localhost:8080/dashboard');
console.log('4. Check the console for debug logs from SubjectCoursesGrid');
console.log('5. Look for any failed API calls in the Network tab');