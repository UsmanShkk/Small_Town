import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, Star, ChefHat, Calendar, ShoppingCart, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVendorProfile, allmeals } from './../api';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlestart = async () => {
    navigate('/login')
  }

  const handleselling = async () => {
    try {
      const res = await fetchVendorProfile();
      if (res && res.isApproved === false) {
        navigate('/vendor/status');
      } else {
        navigate('/register-vendor');
      }
    } catch (error) {
      navigate('/register-vendor');
    }
  };

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Meal Planning",
      description: "AI-powered meal suggestions based on your preferences, dietary restrictions, and schedule."
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Automated Shopping Lists",
      description: "Generate smart shopping lists with ingredients organized by store sections."
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: "Chef-Curated Recipes",
      description: "Access thousands of recipes created by professional chefs and nutrition experts."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time-Saving Solutions",
      description: "Prep schedules and cooking timers to help you create delicious meals efficiently."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "This app has completely transformed how I approach meal planning. I save 3 hours every week!",
      image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Mike Chen",
      rating: 5,
      text: "The recipe suggestions are amazing and the shopping lists are perfectly organized.",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      text: "Finally, a meal planning app that understands my busy lifestyle. Highly recommended!",
      image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  const recipes = [
    {
      image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Healthy Breakfast Bowls",
      time: "15 mins",
      difficulty: "Easy"
    },
    {
      image: "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Gourmet Pasta Dishes",
      time: "25 mins",
      difficulty: "Medium"
    },
    {
      image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Fresh Salad Creations",
      time: "10 mins",
      difficulty: "Easy"
    },
    {
      image: "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Artisan Sandwiches",
      time: "12 mins",
      difficulty: "Easy"
    },
    {
      image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Hearty Soups",
      time: "35 mins",
      difficulty: "Medium"
    },
    {
      image: "https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Decadent Desserts",
      time: "45 mins",
      difficulty: "Hard"
    }
  ];

  const FoodSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const foodSlides = [
      {
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&h=600&q=80",
        title: "Gourmet Burgers",
        subtitle: "Juicy & perfectly crafted"
      },
      {
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&h=600&q=80",
        title: "Wood-Fired Pizza",
        subtitle: "Authentic Italian flavors"
      },
      {
        image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1200&h=600&q=80",
        title: "Crispy Fried Chicken",
        subtitle: "Golden & delicious"
      },
      {
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1200&h=600&q=80",
        title: "Loaded Nachos",
        subtitle: "Cheesy comfort food"
      },
      {
        image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=1200&h=600&q=80",
        title: "Classic Hot Dogs",
        subtitle: "American street food"
      },
      {
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1200&h=600&q=80",
        title: "Loaded Fries",
        subtitle: "Crispy & indulgent"
      }
    ];

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % foodSlides.length);
      }, 3500);

      return () => clearInterval(timer);
    }, [foodSlides.length]);

    return (
      <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative w-full h-full">
          {foodSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl md:text-4xl font-bold mb-2 transform transition-all duration-700 delay-300">
                  {slide.title}
                </h3>
                <p className="text-lg md:text-xl text-gray-200 transform transition-all duration-700 delay-500">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-8 flex space-x-2">
          {foodSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-orange-500 scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + foodSlides.length) % foodSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % foodSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  // Floating animation for food items
  const FloatingFood = ({ children, delay = 0 }) => (
    <div 
      className="floating-food"
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );

  // Hero Background Food Animation Component
  const HeroFoodAnimation = () => {
    const [currentFood, setCurrentFood] = useState(0);
    
    const foodImages = [
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
    ];

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentFood((prev) => (prev + 1) % foodImages.length);
      }, 4000);

      return () => clearInterval(timer);
    }, [foodImages.length]);

    return (
      <div className="absolute inset-0 z-0">
        {foodImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
              index === currentFood 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-110'
            }`}
          >
            <img 
              src={image || "/placeholder.svg"}
              alt="Food background"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/60"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .recipe-card {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .recipe-card:nth-child(1) { animation-delay: 0.1s; }
        .recipe-card:nth-child(2) { animation-delay: 0.2s; }
        .recipe-card:nth-child(3) { animation-delay: 0.3s; }
        .recipe-card:nth-child(4) { animation-delay: 0.4s; }
        .recipe-card:nth-child(5) { animation-delay: 0.5s; }
        .recipe-card:nth-child(6) { animation-delay: 0.6s; }
        
        .food-image {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .food-image:hover {
          transform: scale(1.1) rotate(5deg);
          filter: brightness(1.1) saturate(1.2);
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 1s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-900 { animation-delay: 0.9s; }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">MealPro</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Home</a>
              <a href="/meals" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Menu</a>
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Pricing</a>
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">About</a>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors" onClick={handlestart}>
                Get Started
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors" onClick={handleselling}>Start Selling</button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-orange-500 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-6 space-y-4">
              <a href="#" className="block text-gray-700 hover:text-orange-500 transition-colors font-medium">Home</a>
              <a href="#" className="block text-gray-700 hover:text-orange-500 transition-colors font-medium">Menu</a>
              <a href="#" className="block text-gray-700 hover:text-orange-500 transition-colors font-medium">Pricing</a>
              <a href="#" className="block text-gray-700 hover:text-orange-500 transition-colors font-medium">About</a>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors" onClick={handlestart}>
                Get Started
              </button>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors mt-2" onClick={handleselling}>
                Start Selling
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Clean Food Animation */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Food Background */}
        <HeroFoodAnimation />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="inline-block animate-fade-in-left">Plan Your Perfect</span>
              <span className="text-orange-500 block animate-fade-in-right animation-delay-300">Meals Effortlessly</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed animate-fade-in-up animation-delay-600">
              Transform your kitchen experience with AI-powered meal planning, smart shopping lists, and chef-curated recipes tailored to your lifestyle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-900">
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={handlestart}
              >
                Start Planning Now
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                Explore Recipes
              </button>
            </div>

            <div className="flex flex-wrap gap-8 text-white animate-fade-in-up animation-delay-900">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="text-lg">50K+ Happy Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-orange-500" />
                <span className="text-lg">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-lg">Save 3+ Hours/Week</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Food Slider Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Taste the <span className="text-orange-500">Difference</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover a world of flavors with our curated collection of mouth-watering dishes
            </p>
          </div>
          
          <FoodSlider />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-orange-500">MealPro</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of meal planning with our comprehensive suite of smart features designed to make your life easier.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 group">
                <div className="text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Gallery Section with Enhanced Animations */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover Amazing <span className="text-orange-500">Recipes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From quick weeknight dinners to impressive weekend feasts, explore thousands of delicious recipes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => (
              <FloatingFood key={index} delay={index * 0.5}>
                <div className="recipe-card group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      className="food-image w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {recipe.time}
                        </span>
                        <span className="px-3 py-1 bg-orange-500 rounded-full text-xs font-semibold">
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Star className="w-5 h-5 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingFood>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="text-orange-500">Users Say</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">Verified User</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop"
            alt="Cooking ingredients"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your <span className="text-orange-500">Kitchen Experience</span>?
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join thousands of home cooks who have revolutionized their meal planning with MealPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={handlestart}
            >
              Start Free Trial
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold">MealPro</span>
              </div>
              <p className="text-gray-400">Making meal planning effortless for busy lifestyles.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Recipes</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MealPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
