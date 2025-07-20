// Run this in browser console to clear authentication
console.log('Clearing authentication data...');
localStorage.removeItem('authToken');
sessionStorage.clear();
console.log('Authentication cleared. Please refresh and login again.');