import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle } from 'lucide-react';

const LocationPermissionPage = ({ onLocationGranted, onLocationDenied }) => {
  const [locationStatus, setLocationStatus] = useState('initial'); // initial, requesting, granted, denied, error
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');

  // Function to get user's current location
  const getCurrentLocation = () => {
    setLocationStatus('requesting');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLocationStatus('error');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000 // 10 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          type: "Point",
          coordinates: [
            position.coords.longitude,
            position.coords.latitude
          ]
        };
        
        setUserLocation(location);
        setLocationStatus('granted');
        
        // Call the callback function with location data
        if (onLocationGranted) {
          onLocationGranted(location);
        }
        
        console.log('User location:', location);
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            setLocationStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            setLocationStatus('error');
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            setLocationStatus('error');
            break;
          default:
            errorMessage = 'An unknown error occurred';
            setLocationStatus('error');
            break;
        }
        
        setError(errorMessage);
        
        if (onLocationDenied) {
          onLocationDenied(errorMessage);
        }
      },
      options
    );
  };

  // Auto-request location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleRetry = () => {
    getCurrentLocation();
  };

  const handleSkip = () => {
    setLocationStatus('denied');
    if (onLocationDenied) {
      onLocationDenied('User chose to skip location');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        
        {/* Initial/Requesting State */}
        {(locationStatus === 'initial' || locationStatus === 'requesting') && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {locationStatus === 'requesting' ? (
                  <Navigation className="w-10 h-10 text-orange-600 animate-pulse" />
                ) : (
                  <MapPin className="w-10 h-10 text-orange-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {locationStatus === 'requesting' ? 'Getting Your Location...' : 'Enable Location Access'}
              </h2>
              <p className="text-gray-600">
                {locationStatus === 'requesting' 
                  ? 'Please wait while we detect your location'
                  : 'We need your location to show nearby restaurants and calculate delivery times'
                }
              </p>
            </div>
            
            {locationStatus === 'requesting' && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            )}
          </>
        )}

        {/* Success State */}
        {locationStatus === 'granted' && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Detected!</h2>
              <p className="text-gray-600 mb-4">
                Great! We can now show you nearby restaurants and accurate delivery times.
              </p>
              {userLocation && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  <p className="font-medium">Your coordinates:</p>
                  <p>Lat: {userLocation.coordinates[1].toFixed(6)}</p>
                  <p>Lng: {userLocation.coordinates[0].toFixed(6)}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Error/Denied State */}
        {(locationStatus === 'denied' || locationStatus === 'error') && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {locationStatus === 'denied' ? 'Location Access Denied' : 'Location Error'}
              </h2>
              <p className="text-gray-600 mb-2">
                {locationStatus === 'denied' 
                  ? 'You can still browse restaurants, but delivery times may not be accurate'
                  : 'There was an issue getting your location'
                }
              </p>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleSkip}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Continue Without Location
              </button>
            </div>
          </>
        )}

        {/* Manual Allow Button (for initial state) */}
        {locationStatus === 'initial' && (
          <div className="space-y-3">
            <button
              onClick={getCurrentLocation}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Allow Location Access
            </button>
            <button
              onClick={handleSkip}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Skip for Now
            </button>
          </div>
        )}

        {/* Info text */}
        <p className="text-xs text-gray-500 mt-6">
          Your location data is only used to improve your experience and is not stored permanently.
        </p>
      </div>
    </div>
  );
};

export default LocationPermissionPage;