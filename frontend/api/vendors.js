
export const fetchVendorProfile = async () => {
    const response = await fetch('http://localhost:5000/api/vendor/me', {
      method: 'GET',
      credentials: 'include', // <== sends stored cookie with request
    });
  
    if (!response.ok) {
      throw new Error('Unauthorized or error fetching profile');
    }
  
    const data = await response.json();
    return data.vendor;
  };
