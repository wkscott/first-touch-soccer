import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">First Touch LLC</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Soccer Training</h2>
          <p className="text-xl text-gray-600">Professional training for players grades 5-12</p>
        </div>
        
        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          {/* Schedule Training Button */}
          <Link
            to="/schedule"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Schedule Training</h3>
              <p className="text-sm opacity-90">Book your next session</p>
              <div className="mt-4 text-sm">$50/hour</div>
            </div>
          </Link>

          {/* Payment Button */}
          <Link
            to="/payment"
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Make Payment</h3>
              <p className="text-sm opacity-90">Process session payment</p>
              <div className="mt-4 text-sm">Secure payment</div>
            </div>
          </Link>

          {/* Contact Coach Button */}
          <Link
            to="/contact"
            className="bg-gray-800 hover:bg-gray-900 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Contact Coach</h3>
              <p className="text-sm opacity-90">Direct messaging</p>
              <div className="mt-4 text-sm">Quick response</div>
            </div>
          </Link>
        </div>

        {/* Profile Button */}
        <div className="fixed top-4 right-4">
          <Link
            to="/profile"
            className="bg-white text-blue-600 border-2 border-blue-600 rounded-lg px-6 py-2 hover:bg-blue-50 transition-colors duration-200"
          >
            Create Profile
          </Link>
        </div>
      </main>
    </div>
  );
}

export default HomePage; 