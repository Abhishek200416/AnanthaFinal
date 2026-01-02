import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/rejected cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async () => {
    setIsSubscribing(true);
    
    try {
      // Subscribe to newsletter if email provided
      if (email && email.includes('@')) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
        const response = await fetch(`${backendUrl}/api/newsletter/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            source: 'cookie'
          })
        });

        if (response.ok) {
          console.log('Successfully subscribed to newsletter');
        }
      }

      // Save consent to localStorage
      localStorage.setItem('cookieConsent', 'accepted');
      setShowConsent(false);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      // Still accept cookies even if subscription fails
      localStorage.setItem('cookieConsent', 'accepted');
      setShowConsent(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={handleDecline}
      />
      
      {/* Consent Popup */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl pointer-events-auto mb-4 transform transition-all duration-300 animate-slide-up">
        <button
          onClick={handleDecline}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <Cookie className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">🍪 We Value Your Privacy</h3>
          </div>

          {/* Content */}
          <p className="text-gray-600 mb-4 leading-relaxed">
            We use cookies to enhance your experience and provide personalized services. 
            By accepting, you'll also receive exclusive updates about our traditional homemade delicacies!
          </p>

          {/* Newsletter Subscription */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl mb-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📧</span>
              <p className="font-semibold text-gray-800">Subscribe to our Newsletter</p>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Get notified about new products, special offers, and exclusive recipes!
            </p>
            <input
              type="email"
              placeholder="Enter your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              disabled={isSubscribing}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubscribing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Accept & Subscribe'
              )}
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Decline
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By accepting, you agree to our terms and privacy policy. You can unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
