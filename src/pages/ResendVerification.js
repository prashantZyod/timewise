import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [formError, setFormError] = useState('');
  const { resendVerificationEmail, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email) {
      setFormError('Please enter your email address');
      return;
    }
    
    try {
      await resendVerificationEmail(email);
      setEmailSent(true);
    } catch (err) {
      setFormError(err.message);
    }
  };
  
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Check Your Email</h2>
            <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
              We've sent a verification link to {email}. Please check your email and click the link to verify your account.
            </p>
          </div>
          
          <div className="text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
            <p className="text-sm">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={handleSubmit}
                disabled={loading}
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Clock className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Resend Verification</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you a new verification link
          </p>
        </div>
        
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Verification Link'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResendVerification;