import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  const { verifyEmail, loading } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('Invalid verification link. No token provided.');
        return;
      }
      
      try {
        await verifyEmail(token);
        setVerificationStatus('success');
        
        // Redirect to dashboard after 3 seconds on success
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (err) {
        setVerificationStatus('error');
        setErrorMessage(err.message || 'Failed to verify email. Please try again.');
      }
    };
    
    verifyToken();
  }, [token, verifyEmail, navigate]);
  
  if (verificationStatus === 'verifying' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Clock className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verifying Your Email</h2>
          <div className="flex justify-center mt-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }
  
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Email Verified</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
            Your email has been successfully verified! You'll be redirected to the dashboard in a moment.
          </p>
          <div className="mt-6">
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verification Failed</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">
          {errorMessage}
        </div>
        <p className="mt-4 text-sm text-gray-600 max-w-sm mx-auto">
          The verification link may be invalid or expired. Please try again or request a new verification email.
        </p>
        <div className="mt-6 space-y-3">
          <Link 
            to="/resend-verification" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Resend Verification Email
          </Link>
          <div>
            <Link 
              to="/login" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;