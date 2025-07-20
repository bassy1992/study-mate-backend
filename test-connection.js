// Simple Node.js script to test Django backend connection
const https = require('http');

async function testConnection() {
  console.log('Testing Django Backend Connection...\n');
  
  const endpoints = [
    { name: 'Health Check', path: '/api/health/' },
    { name: 'API Overview', path: '/api/' },
    { name: 'Courses', path: '/api/courses/' },
    { name: 'BECE Tests', path: '/api/bece/' },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint.path}`);
      const status = response.ok ? '✅ OK' : '❌ ERROR';
      console.log(`${status} ${endpoint.name}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Connection failed - ${error.message}`);
    }
    console.log('');
  }
}

testConnection().catch(console.error);