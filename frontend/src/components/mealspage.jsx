import { allmeals } from './../api';
import { Search, Filter, X, MapPin, Navigation } from 'lucide-react';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

// Location Permission Component
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
                <MapPin className="w-10 h-10 text-green-600" />
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
                <X className="w-10 h-10 text-red-600" />
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

// Smooth Range Slider Component
const SmoothRangeSlider = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  unit = '',
  step = 1 
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const [tempValue, setTempValue] = useState(value);
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  // Update temp value when prop value changes (only if not currently dragging)
  useEffect(() => {
    if (!isDragging) {
      setTempValue(value);
    }
  }, [value, isDragging]);

  const getValueFromPosition = useCallback((clientX) => {
    if (!sliderRef.current) return null;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round((min + percent * (max - min)) / step) * step;
  }, [min, max, step]);

  const handleMouseDown = useCallback((e, thumb) => {
    e.preventDefault();
    setIsDragging(thumb);
    
    // Immediate visual feedback
    const newValue = getValueFromPosition(e.clientX);
    if (newValue !== null) {
      setTempValue(prevTemp => {
        if (thumb === 'min' && newValue <= prevTemp[1] && newValue >= min) {
          return [newValue, prevTemp[1]];
        } else if (thumb === 'max' && newValue >= prevTemp[0] && newValue <= max) {
          return [prevTemp[0], newValue];
        }
        return prevTemp;
      });
    }
  }, [getValueFromPosition, min, max]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    // Cancel any pending animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Use requestAnimationFrame for smooth updates
    animationRef.current = requestAnimationFrame(() => {
      const newValue = getValueFromPosition(e.clientX);
      if (newValue !== null) {
        setTempValue(prevTemp => {
          if (isDragging === 'min' && newValue <= prevTemp[1] && newValue >= min) {
            return [newValue, prevTemp[1]];
          } else if (isDragging === 'max' && newValue >= prevTemp[0] && newValue <= max) {
            return [prevTemp[0], newValue];
          }
          return prevTemp;
        });
      }
    });
  }, [isDragging, getValueFromPosition, min, max]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && onChange) {
      // Only call onChange on mouse up to prevent excessive filtering
      onChange(tempValue);
    }
    setIsDragging(null);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [isDragging, tempValue, onChange]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e, thumb) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMouseDown({ ...e, clientX: touch.clientX, preventDefault: () => {} }, thumb);
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMouseMove({ ...e, clientX: touch.clientX });
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  // Attach global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getPercent = useCallback((val) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const minPercent = getPercent(tempValue[0]);
  const maxPercent = getPercent(tempValue[1]);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3 text-gray-700">
        {label}: <span className="font-semibold text-blue-600">{tempValue[0]}{unit} - {tempValue[1]}{unit}</span>
      </label>
      <div className="relative px-3 py-4 select-none">
        {/* Track background */}
        <div 
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        >
          {/* Active range */}
          <div
            className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-75"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
          
          {/* Min thumb */}
          <div
            className={`absolute w-5 h-5 -mt-1.5 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-grab transform -translate-x-1/2 z-10 transition-all duration-100 hover:scale-110 active:scale-110 ${
              isDragging === 'min' 
                ? 'scale-110 shadow-xl border-blue-600 cursor-grabbing' 
                : ''
            }`}
            style={{ 
              left: `${minPercent}%`,
              willChange: isDragging === 'min' ? 'transform' : 'auto'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'min')}
            onTouchStart={(e) => handleTouchStart(e, 'min')}
          />
          
          {/* Max thumb */}
          <div
            className={`absolute w-5 h-5 -mt-1.5 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-grab transform -translate-x-1/2 z-10 transition-all duration-100 hover:scale-110 active:scale-110 ${
              isDragging === 'max' 
                ? 'scale-110 shadow-xl border-blue-600 cursor-grabbing' 
                : ''
            }`}
            style={{ 
              left: `${maxPercent}%`,
              willChange: isDragging === 'max' ? 'transform' : 'auto'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'max')}
            onTouchStart={(e) => handleTouchStart(e, 'max')}
          />
        </div>
        
        {/* Value indicators */}
        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Location states
  const [showLocationPage, setShowLocationPage] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  
  // Nutrition range filters
  const [caloriesRange, setCaloriesRange] = useState([0, 1000]);
  const [proteinRange, setProteinRange] = useState([0, 50]);
  const [carbsRange, setCarbsRange] = useState([0, 100]);
  const [fatRange, setFatRange] = useState([0, 50]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Store actual data ranges for slider bounds
  const [dataRanges, setDataRanges] = useState({
    calories: [0, 1000],
    protein: [0, 50],
    carbs: [0, 100],
    fat: [0, 50]
  });

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1, point2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (point2.coordinates[1] - point1.coordinates[1]) * Math.PI / 180;
    const dLon = (point2.coordinates[0] - point1.coordinates[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.coordinates[1] * Math.PI / 180) * Math.cos(point2.coordinates[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Location callback functions
  const handleLocationGranted = (location) => {
    setUserLocation(location);
    setLocationEnabled(true);
    setShowLocationPage(false);
    console.log('User location granted:', location);
  };

  const handleLocationDenied = (error) => {
    console.log('Location denied:', error);
    setLocationEnabled(false);
    setShowLocationPage(false);
    // Continue showing all meals without location filtering
  };

  // Location status component
  const LocationStatus = () => {
    if (locationEnabled && userLocation) {
      return (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            📍 Showing meals within 10km of your location
            <button 
              onClick={() => {
                setLocationEnabled(false);
                setUserLocation(null);
              }}
              className="ml-2 text-green-600 hover:text-green-800 underline"
            >
              Show all meals
            </button>
          </p>
        </div>
      );
    }
    
    if (!locationEnabled) {
      return (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            🌍 Showing all available meals
            <button 
              onClick={() => setShowLocationPage(true)}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Enable location for nearby meals
            </button>
          </p>
        </div>
      );
    }
    
    return null;
  };

  useEffect(() => {
    async function fetchMeals() {
      try {
        const res = await allmeals();
        setMeals(res.data);
        
        // Set initial ranges based on actual data
        if (res.data.length > 0) {
          const calories = res.data.map(m => m.nutrition.calories);
          const proteins = res.data.map(m => m.nutrition.protein);
          const carbs = res.data.map(m => m.nutrition.carbohydrates);
          const fats = res.data.map(m => m.nutrition.fat);
          
          const caloriesMin = Math.min(...calories);
          const caloriesMax = Math.max(...calories);
          const proteinsMin = Math.min(...proteins);
          const proteinsMax = Math.max(...proteins);
          const carbsMin = Math.min(...carbs);
          const carbsMax = Math.max(...carbs);
          const fatsMin = Math.min(...fats);
          const fatsMax = Math.max(...fats);
          
          setCaloriesRange([caloriesMin, caloriesMax]);
          setProteinRange([proteinsMin, proteinsMax]);
          setCarbsRange([carbsMin, carbsMax]);
          setFatRange([fatsMin, fatsMax]);
          
          // Store actual min/max for slider bounds
          setDataRanges({
            calories: [caloriesMin, caloriesMax],
            protein: [proteinsMin, proteinsMax],
            carbs: [carbsMin, carbsMax],
            fat: [fatsMin, fatsMax]
          });
        }
      } catch (error) {
        console.error('Failed to fetch meals:', error);
      }
    }

    fetchMeals();
  }, []);

  // Get unique values for dropdowns
  const uniqueVendors = useMemo(() => {
    return [...new Set(meals.map(meal => meal.vendorId?.name).filter(Boolean))];
  }, [meals]);

  const uniqueTags = useMemo(() => {
    return [...new Set(meals.flatMap(meal => meal.tags || []))];
  }, [meals]);

  const uniqueAllergens = useMemo(() => {
    return [...new Set(meals.flatMap(meal => meal.allergens || []))];
  }, [meals]);

  // Filter meals with location filtering
  const filteredMeals = useMemo(() => {
    let mealsToFilter = meals;
    
    // Apply location filtering first if location is enabled
    if (locationEnabled && userLocation) {
      mealsToFilter = meals.filter(meal => {
        // Check if meal has vendor location data
        if (!meal.vendorId?.location || !meal.vendorId.location.coordinates) {
          return false; // Exclude meals without location data
        }
        
        const distance = calculateDistance(userLocation, meal.vendorId.location);
        return distance <= 10; // 10km range
      });
    }
    
    // Apply existing filters
    return mealsToFilter.filter(meal => {
      // Search term filter (name, description, vendor)
      const searchMatch = searchTerm === '' || 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.vendorId?.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Vendor filter
      const vendorMatch = selectedVendor === '' || meal.vendorId?.name === selectedVendor;

      // Tags filter
      const tagsMatch = selectedTags.length === 0 || 
        selectedTags.every(tag => meal.tags?.includes(tag));

      // Allergens filter
      const allergensMatch = selectedAllergens.length === 0 || 
        selectedAllergens.every(allergen => meal.allergens?.includes(allergen));

      // Nutrition filters
      const caloriesMatch = meal.nutrition.calories >= caloriesRange[0] && 
        meal.nutrition.calories <= caloriesRange[1];
      const proteinMatch = meal.nutrition.protein >= proteinRange[0] && 
        meal.nutrition.protein <= proteinRange[1];
      const carbsMatch = meal.nutrition.carbohydrates >= carbsRange[0] && 
        meal.nutrition.carbohydrates <= carbsRange[1];
      const fatMatch = meal.nutrition.fat >= fatRange[0] && 
        meal.nutrition.fat <= fatRange[1];

      return searchMatch && vendorMatch && tagsMatch && allergensMatch && 
        caloriesMatch && proteinMatch && carbsMatch && fatMatch;
    });
  }, [meals, searchTerm, selectedVendor, selectedTags, selectedAllergens, 
      caloriesRange, proteinRange, carbsRange, fatRange, locationEnabled, userLocation]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMeals = filteredMeals.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedVendor, selectedTags, selectedAllergens, 
      caloriesRange, proteinRange, carbsRange, fatRange, locationEnabled, userLocation]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedVendor('');
    setSelectedTags([]);
    setSelectedAllergens([]);
    setCurrentPage(1); // Reset pagination when clearing filters
    if (meals.length > 0) {
      const calories = meals.map(m => m.nutrition.calories);
      const proteins = meals.map(m => m.nutrition.protein);
      const carbs = meals.map(m => m.nutrition.carbohydrates);
      const fats = meals.map(m => m.nutrition.fat);
      
      const caloriesMin = Math.min(...calories);
      const caloriesMax = Math.max(...calories);
      const proteinsMin = Math.min(...proteins);
      const proteinsMax = Math.max(...proteins);
      const carbsMin = Math.min(...carbs);
      const carbsMax = Math.max(...carbs);
      const fatsMin = Math.min(...fats);
      const fatsMax = Math.max(...fats);
      
      setCaloriesRange([caloriesMin, caloriesMax]);
      setProteinRange([proteinsMin, proteinsMax]);
      setCarbsRange([carbsMin, carbsMax]);
      setFatRange([fatsMin, fatsMax]);
      
      setDataRanges({
        calories: [caloriesMin, caloriesMax],
        protein: [proteinsMin, proteinsMax],
        carbs: [carbsMin, carbsMax],
        fat: [fatsMin, fatsMax]
      });
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleAllergen = (allergen) => {
    setSelectedAllergens(prev => 
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  return (
    <div>
      {showLocationPage ? (
        <LocationPermissionPage 
          onLocationGranted={handleLocationGranted}
          onLocationDenied={handleLocationDenied}
        />
      ) : (
        <div className="p-6">
          {/* Location status indicator */}
          <LocationStatus />
          <div className="mb-4">
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ⬅️ Back to Home
          </Link>
        </div>

          {/* Search and Filter Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search meals, vendors, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vendor Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Vendor</label>
                  <select
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Vendors</option>
                    {uniqueVendors.map(vendor => (
                      <option key={vendor} value={vendor}>{vendor}</option>
                    ))}
                  </select>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="max-h-32 overflow-y-auto">
                    {uniqueTags.map(tag => (
                      <label key={tag} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="mr-2"
                        />
                        <span className="text-sm">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Allergens Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Allergens</label>
                  <div className="max-h-32 overflow-y-auto">
                    {uniqueAllergens.map(allergen => (
                      <label key={allergen} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={selectedAllergens.includes(allergen)}
                          onChange={() => toggleAllergen(allergen)}
                          className="mr-2"
                        />
                        <span className="text-sm">{allergen}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nutrition Range Sliders */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SmoothRangeSlider
                  label="Calories"
                  value={caloriesRange}
                  onChange={setCaloriesRange}
                  min={dataRanges.calories[0]}
                  max={dataRanges.calories[1]}
                  unit=" cal"
                  step={5}
                />
                <SmoothRangeSlider
                  label="Protein"
                  value={proteinRange}
                  onChange={setProteinRange}
                  min={dataRanges.protein[0]}
                  max={dataRanges.protein[1]}
                  unit="g"
                  step={1}
                />
                <SmoothRangeSlider
                  label="Carbohydrates"
                  value={carbsRange}
                  onChange={setCarbsRange}
                  min={dataRanges.carbs[0]}
                  max={dataRanges.carbs[1]}
                  unit="g"
                  step={1}
                />
                <SmoothRangeSlider
                  label="Fat"
                  value={fatRange}
                  onChange={setFatRange}
                  min={dataRanges.fat[0]}
                  max={dataRanges.fat[1]}
                  unit="g"
                  step={1}
                />
              </div>
            </div>
          )}

          {/* Results Count and Pagination Info */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredMeals.length)} of {filteredMeals.length} meals
            </p>
            {totalPages > 1 && (
              <p className="text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Meals Grid */}
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMeals.map((meal) => (
              <Link
                to={`/meal/${meal._id}`}
                key={meal._id}
                className="border rounded-2xl shadow p-4 hover:shadow-lg transition-all block"
              >
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />

                <h2 className="text-xl font-semibold mb-1">{meal.name}</h2>
                <p className="text-green-600 font-bold text-lg mb-2">Rs. {meal.price}</p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Vendor:</strong> {meal.vendorId?.name}
                </p>

                {/* Distance indicator if location is enabled */}
                {locationEnabled && userLocation && meal.vendorId?.location && (
                  <p className="text-xs text-blue-600 mb-2">
                    📍 {calculateDistance(userLocation, meal.vendorId.location).toFixed(1)}km away
                  </p>
                )}

                {/* Nutrition Info */}
                <div className="text-xs text-gray-500 mb-2">
                  {meal.nutrition.calories} cal | {meal.nutrition.protein}g protein | 
                  {meal.nutrition.carbohydrates}g carbs | {meal.nutrition.fat}g fat
                </div>

                {/* Allergens */}
                {meal.allergens?.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-red-600 font-semibold">Allergens: </span>
                    {meal.allergens.map((allergen, idx) => (
                      <span key={idx} className="text-xs text-red-600">
                        {allergen}{idx < meal.allergens.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {meal.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {meal.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
            

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = pageNum === 1 || 
                                 pageNum === totalPages || 
                                 Math.abs(pageNum - currentPage) <= 2;
                  
                  // Show ellipsis
                  const showEllipsis = (pageNum === 2 && currentPage > 4) ||
                                     (pageNum === totalPages - 1 && currentPage < totalPages - 3);

                  if (!showPage && !showEllipsis) return null;

                  if (showEllipsis) {
                    return (
                      <span key={pageNum} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          )}

          {filteredMeals.length === 0 && meals.length > 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No meals match your current filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}