import React, { useState, useEffect } from "react";
import { useDevice } from "../contexts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Loader2, Shield, Smartphone, Check, Info, X, Clock, RefreshCw, AlertTriangle } from "lucide-react";

/**
 * Generate a device fingerprint based on browser and hardware characteristics
 * @returns {Promise<string>} A string hash representing the device
 */
export const getDeviceFingerprint = async () => {
    // Collect a variety of device/browser characteristics
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const renderer = gl ? gl.getParameter(gl.RENDERER) : '';
    const webglVendor = gl ? gl.getParameter(gl.VENDOR) : '';
    
    // Get more detailed browser information
    const platform = navigator.platform || '';
    const plugins = Array.from(navigator.plugins || [])
        .map(p => p.name)
        .join(',');
    
    // Get additional device capabilities for more accuracy
    const touchPoints = navigator.maxTouchPoints || 0;
    const connection = navigator.connection ? 
        `${navigator.connection.effectiveType || ''}-${navigator.connection.downlink || ''}` : '';
    const hasBluetooth = navigator.bluetooth ? 'yes' : 'no';
    
    // Combine all characteristics
    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset(),
        window.screen.height,
        window.screen.width,
        window.screen.colorDepth,
        renderer,
        webglVendor,
        platform,
        plugins,
        navigator.hardwareConcurrency || '',
        navigator.deviceMemory || '',
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        touchPoints,
        connection,
        hasBluetooth
    ].filter(Boolean).join('###');

    // More robust hash function (djb2)
    let hash = 5381;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) + hash) + char;
    }
    
    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
        console.debug('Device fingerprinting data collected:', { 
            platform, 
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            resolution: `${window.screen.width}x${window.screen.height}`,
            cores: navigator.hardwareConcurrency || 'unknown',
            memory: navigator.deviceMemory || 'unknown',
            touchPoints,
            connection
        });
    }
    
    return Math.abs(hash).toString(36);
};

const DeviceApprovalGate = ({ user, children, timeoutDuration = 15000 }) => {
    const [deviceStatus, setDeviceStatus] = useState('loading'); // loading, approved, pending, new, error, timeout
    const [isRequestingApproval, setIsRequestingApproval] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(10);
    const [lastCheck, setLastCheck] = useState(null);
    const { filterDevices, createDevice, loading: deviceLoading, error: deviceError } = useDevice();

    // Check device approval status when component mounts or user changes
    useEffect(() => {
        let timeoutId;
        let progressIntervalId;
        let isMounted = true;
        
        const checkDeviceApproval = async () => {
            // Validate user object
            if (!user || !user.id) {
                console.warn("DeviceApprovalGate: No valid user provided");
                if (isMounted) {
                    setDeviceStatus('loading');
                    // If we're still in loading state and no user after 2 seconds, show auth required
                    setTimeout(() => {
                        if (isMounted && (!user || !user.id) && deviceStatus === 'loading') {
                            setDeviceStatus('auth_required');
                        }
                    }, 2000);
                }
                return;
            }

            try {
                // Start progressive loading animation
                progressIntervalId = setInterval(() => {
                    if (isMounted) {
                        setLoadingProgress(prev => {
                            // Max out at 90% until we actually complete
                            return prev < 90 ? prev + 5 : prev;
                        });
                    }
                }, 500);
                
                // Set a timeout for the operation
                timeoutId = setTimeout(() => {
                    if (isMounted && deviceStatus === 'loading') {
                        clearInterval(progressIntervalId);
                        setErrorMessage('Device verification timed out. Please check your internet connection and try again.');
                        setDeviceStatus('timeout');
                    }
                }, timeoutDuration);
                
                // Get current device fingerprint
                const fingerprint = await getDeviceFingerprint();
                
                // Get user's approved devices
                const devices = await filterDevices({ user_id: user.id, fingerprint });
                
                // Clear the timeout since we got a response
                clearTimeout(timeoutId);
                
                if (isMounted) {
                    setLastCheck(new Date().toISOString());
                    
                    // Complete the progress bar animation
                    clearInterval(progressIntervalId);
                    setLoadingProgress(100);
                    
                    if (Array.isArray(devices) && devices.length > 0) {
                        const device = devices[0];
                        if (device && device.is_approved) {
                            // Store the approved device info in local storage for quicker checks on future visits
                            try {
                                localStorage.setItem('timeWise_approvedDevice', JSON.stringify({
                                    fingerprint,
                                    userId: user.id,
                                    approvedAt: new Date().toISOString()
                                }));
                            } catch (e) {
                                // Local storage might be disabled, just continue
                                console.warn('Could not store device approval in local storage:', e);
                            }
                            
                            setDeviceStatus('approved');
                        } else {
                            // Update the device's last check time
                            if (device.id) {
                                try {
                                    // This would typically be a backend API call
                                    console.log('Updating device last check time:', device.id);
                                    // await updateDeviceLastCheck(device.id);
                                } catch (e) {
                                    console.warn('Could not update device last check time:', e);
                                }
                            }
                            
                            setDeviceStatus('pending');
                        }
                    } else {
                        // Check if there's a browser policy requiring all new devices to be approved
                        const requiresApproval = true; // This would come from company policy configuration
                        
                        if (requiresApproval) {
                            // New device, needs registration
                            setDeviceStatus('new');
                        } else {
                            // Auto-approve for this demo
                            setDeviceStatus('approved');
                        }
                    }
                }
            } catch (error) {
                // Clear intervals and timeouts
                clearTimeout(timeoutId);
                clearInterval(progressIntervalId);
                
                console.error("Error checking device approval:", error);
                
                if (isMounted) {
                    setErrorMessage(error.message || 'Failed to verify device status');
                    setDeviceStatus('error');
                    
                    // Log detailed error for diagnostics
                    if (process.env.NODE_ENV === 'development') {
                        console.debug('Device approval check error details:', {
                            userId: user?.id,
                            timestamp: new Date().toISOString(),
                            errorName: error.name,
                            errorMessage: error.message,
                            errorStack: error.stack
                        });
                    }
                }
            }
        };

        if (isMounted) {
            setDeviceStatus('loading');
            setLoadingProgress(10);
            
            // Check for cached device approval first (faster experience for returning users)
            try {
                const cachedDevice = localStorage.getItem('timeWise_approvedDevice');
                if (cachedDevice) {
                    const parsedDevice = JSON.parse(cachedDevice);
                    // If the cached approval is for the current user and less than 24 hours old
                    const approvedTimestamp = new Date(parsedDevice.approvedAt).getTime();
                    const now = new Date().getTime();
                    const oneDay = 24 * 60 * 60 * 1000;
                    
                    if (parsedDevice.userId === user?.id && (now - approvedTimestamp) < oneDay) {
                        // Verify the fingerprint matches before auto-approving
                        getDeviceFingerprint().then(currentFingerprint => {
                            if (currentFingerprint === parsedDevice.fingerprint && isMounted) {
                                console.log('Using cached device approval');
                                setLoadingProgress(100);
                                setDeviceStatus('approved');
                                return; // Skip server check
                            } else {
                                // Fingerprint doesn't match, continue with server check
                                checkDeviceApproval();
                            }
                        });
                    } else {
                        // Cached approval is expired or for different user, do server check
                        checkDeviceApproval();
                    }
                } else {
                    // No cached approval, do server check
                    checkDeviceApproval();
                }
            } catch (e) {
                // Local storage might be disabled, fall back to server check
                console.warn('Could not read device approval from local storage:', e);
                checkDeviceApproval();
            }
        }
        
        // Cleanup function
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            clearInterval(progressIntervalId);
        };
    }, [user, filterDevices, deviceStatus, timeoutDuration]);

    /**
     * Request approval for the current device
     */
    /**
     * Request approval for the current device with enhanced validation and tracking
     * @returns {Promise<void>}
     */
    const requestApproval = async () => {
        setIsRequestingApproval(true);
        setErrorMessage('');
        
        try {
            // Enhanced validation with detailed error messages
            if (!user) {
                throw new Error('User session not available');
            }
            
            if (!user.id) {
                throw new Error('User ID is missing from session data');
            }
            
            if (!user.email && !user.phone) {
                throw new Error('Contact information missing - approval notifications cannot be sent');
            }
            
            // Generate device fingerprint
            const fingerprint = await getDeviceFingerprint();
            
            // Get browser and OS info more accurately
            const userAgent = navigator.userAgent;
            const browserInfo = detectBrowser(userAgent);
            const osInfo = detectOS(userAgent);
            
            // Create device record with enhanced metadata
            const newDevice = await createDevice({
                user_id: user.id,
                fingerprint,
                name: generateDeviceName(browserInfo, osInfo, user),
                type: detectDeviceType(),
                user_agent: navigator.userAgent,
                browser: browserInfo.name,
                browser_version: browserInfo.version,
                operating_system: osInfo.name,
                os_version: osInfo.version,
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                ip_address: '',  // This would be set server-side
                location: '',    // This would be set server-side
                hardware_concurrency: navigator.hardwareConcurrency || null,
                device_memory: navigator.deviceMemory || null,
                connection_type: navigator.connection ? navigator.connection.effectiveType : null,
                is_mobile: /Mobi|Android/i.test(navigator.userAgent),
                last_ping: new Date().toISOString(),
                is_active: true,
                is_approved: false,
                approval_requested_at: new Date().toISOString(),
                registered_at: new Date().toISOString(),
                geolocation_permission: navigator.permissions ? 
                    await navigator.permissions.query({name:'geolocation'}).then(result => result.state) : 'unknown'
            });
            
            if (newDevice) {
                // Track the device registration event
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'device_registration', {
                        'event_category': 'security',
                        'event_label': browserInfo.name,
                        'user_id': user.id
                    });
                }
                
                setDeviceStatus('pending');
                
                // If we have the user's email, we can notify them about the request
                if (user.email && typeof window.sendDeviceApprovalEmail === 'function') {
                    window.sendDeviceApprovalEmail(user.email, newDevice.id);
                }
            } else {
                throw new Error('Failed to register device - server response was empty');
            }
        } catch (error) {
            console.error("Error requesting device approval:", error);
            setErrorMessage(error.message || 'Failed to request device approval');
            setDeviceStatus('error');
            
            // Log the error for monitoring
            if (typeof window.logError === 'function') {
                window.logError('device_approval_failure', {
                    message: error.message,
                    stack: error.stack,
                    userId: user?.id
                });
            }
        } finally {
            setIsRequestingApproval(false);
        }
    };
    
    /**
     * Detect browser name and version from user agent
     * @param {string} userAgent - The browser's user agent string
     * @returns {Object} Browser name and version
     */
    const detectBrowser = (userAgent) => {
        const ua = userAgent.toLowerCase();
        let match = ua.match(/(chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        let version = match[2];
        let name = match[1];
        
        // Special case for Chrome/Chromium/Edge
        if (/chrome|chromium|crios/i.test(ua)) {
            name = 'Chrome';
            if (/edg/i.test(ua)) name = 'Edge';
            if (/opr|opera/i.test(ua)) name = 'Opera';
        } 
        // Special case for Safari
        else if (name === 'safari') {
            match = ua.match(/version\/(\d+)/i);
            version = match ? match[1] : '';
        }
        // Special case for IE
        else if (name === 'msie' || name === 'trident') {
            name = 'Internet Explorer';
            match = ua.match(/(?:msie |rv:)(\d+)/i);
            version = match ? match[1] : '';
        }
        
        return { name, version };
    };
    
    /**
     * Detect operating system from user agent
     * @param {string} userAgent - The browser's user agent string
     * @returns {Object} OS name and version
     */
    const detectOS = (userAgent) => {
        const ua = userAgent.toLowerCase();
        let name = 'Unknown';
        let version = '';
        
        if (/windows nt/i.test(ua)) {
            name = 'Windows';
            const windowsVersion = {
                '10.0': '10', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.2': 'XP', '5.1': 'XP'
            };
            const match = ua.match(/windows nt (\d+\.\d+)/i);
            version = match && windowsVersion[match[1]] ? windowsVersion[match[1]] : '';
        } else if (/macintosh|mac os x/i.test(ua)) {
            name = 'macOS';
            const match = ua.match(/mac os x (\d+[._]\d+)/i);
            version = match ? match[1].replace('_', '.') : '';
        } else if (/android/i.test(ua)) {
            name = 'Android';
            const match = ua.match(/android (\d+(\.\d+)?)/i);
            version = match ? match[1] : '';
        } else if (/ios|iphone|ipad|ipod/i.test(ua)) {
            name = 'iOS';
            const match = ua.match(/os (\d+[_]\d+)/i);
            version = match ? match[1].replace('_', '.') : '';
        } else if (/linux/i.test(ua)) {
            name = 'Linux';
        }
        
        return { name, version };
    };
    
    /**
     * Detect device type (desktop, tablet, mobile, etc.)
     * @returns {string} Device type
     */
    const detectDeviceType = () => {
        const ua = navigator.userAgent.toLowerCase();
        
        if (/ipad|tablet|playbook|silk/i.test(ua)) {
            return 'tablet';
        } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
            return 'mobile';
        } else {
            return 'desktop';
        }
    };
    
    /**
     * Generate a user-friendly device name
     * @param {Object} browser - Browser information
     * @param {Object} os - OS information
     * @param {Object} user - User information
     * @returns {string} A user-friendly device name
     */
    const generateDeviceName = (browser, os, user) => {
        const userName = user.name || user.firstName || 'User';
        const deviceType = detectDeviceType();
        const deviceTypeName = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
        
        return `${userName}'s ${os.name} ${deviceTypeName} (${browser.name})`;
    };

    if (deviceStatus === 'loading' || deviceLoading) {
        // Use the actual loading progress state
        const loadingProgressStyle = {
            width: `${loadingProgress}%`
        };
        
        // Determine loading stage based on progress
        let loadingStage = 'Initializing security check';
        if (loadingProgress > 30) loadingStage = 'Verifying device fingerprint';
        if (loadingProgress > 60) loadingStage = 'Checking authorization records';
        if (loadingProgress > 80) loadingStage = 'Finalizing verification';

        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto border border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">Verifying Device</h2>
                    <p className="text-slate-500 mb-4">
                        Please wait while TimeWise verifies your device for secure access.
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg mb-5 text-left">
                        <p className="text-sm text-slate-600 font-medium">{loadingStage}</p>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div 
                            className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
                            style={loadingProgressStyle}
                        ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                        This process helps ensure your attendance data remains secure.
                    </p>
                </div>
            </div>
        );
    }
    
    if (deviceStatus === 'timeout') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto border border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">Verification Timeout</h2>
                    <Alert variant="warning" className="mb-6 mt-4">
                        <AlertTitle className="flex items-center font-medium">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Connection Issue
                        </AlertTitle>
                        <AlertDescription>
                            {errorMessage || 'The device verification process is taking longer than expected. This may be due to network connectivity issues.'}
                        </AlertDescription>
                    </Alert>
                    <div className="bg-slate-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-slate-800 mb-2">Troubleshooting steps:</h3>
                        <ul className="text-sm text-slate-600 space-y-1">
                            <li>• Check your internet connection</li>
                            <li>• Ensure you're not using a VPN (if possible)</li>
                            <li>• Try refreshing the page</li>
                            <li>• If the problem persists, contact IT support</li>
                        </ul>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry Verification
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (deviceStatus === 'auth_required') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto border border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">Authentication Required</h2>
                    <Alert className="mb-6 mt-4">
                        <AlertTitle className="flex items-center font-medium">
                            <Info className="w-4 h-4 mr-2" />
                            Session Expired
                        </AlertTitle>
                        <AlertDescription>
                            Your session has expired or you have not logged in. Please sign in to continue using TimeWise.
                        </AlertDescription>
                    </Alert>
                    <Button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-emerald-600 hover:bg-emerald-700 w-full"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    if (deviceStatus === 'error') {
        // Generate a unique error code for support reference
        const errorCode = `ERR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        // Categorize errors for better user guidance
        let errorCategory = 'system';
        let errorSolution = 'Try refreshing the page. If the problem persists, please contact your system administrator.';
        
        if (errorMessage?.includes('network') || errorMessage?.includes('connect') || 
            errorMessage?.includes('timeout') || errorMessage?.includes('offline')) {
            errorCategory = 'network';
            errorSolution = 'Please check your internet connection and try again. If you\'re on a corporate network, there might be firewall restrictions.';
        } else if (errorMessage?.includes('permission') || errorMessage?.includes('access') || 
                   errorMessage?.includes('denied') || errorMessage?.includes('unauthorized')) {
            errorCategory = 'permission';
            errorSolution = 'You don\'t have permission to register this device. Please contact your administrator for assistance.';
        } else if (errorMessage?.includes('storage') || errorMessage?.includes('quota') || 
                   errorMessage?.includes('localStorage')) {
            errorCategory = 'browser';
            errorSolution = 'Your browser settings may be restricting this application. Try enabling cookies and local storage or use a different browser.';
        }

        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto border border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">Verification Error</h2>
                    <div className="bg-amber-50 text-amber-800 text-xs px-3 py-1 rounded-full inline-block mb-4">
                        Error Code: {errorCode}
                    </div>
                    <Alert variant="destructive" className="mb-6 mt-2">
                        <AlertTitle className="flex items-center font-medium">
                            <X className="w-4 h-4 mr-2" />
                            Device Verification Failed
                        </AlertTitle>
                        <AlertDescription>
                            {errorMessage || deviceError || 'We encountered an error while verifying your device. This may be due to connectivity issues or system maintenance.'}
                        </AlertDescription>
                    </Alert>
                    
                    <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left">
                        <h3 className="font-medium text-slate-800 mb-2">Recommended Solution:</h3>
                        <p className="text-sm text-slate-600">
                            {errorSolution}
                        </p>
                        
                        {errorCategory === 'network' && (
                            <div className="mt-3 text-xs text-slate-500 space-y-1">
                                <p>• Check if you can access other websites</p>
                                <p>• Try disabling VPN or proxy services</p>
                                <p>• Consider using a mobile hotspot temporarily</p>
                            </div>
                        )}
                        
                        {errorCategory === 'browser' && (
                            <div className="mt-3 text-xs text-slate-500 space-y-1">
                                <p>• Make sure cookies are enabled</p>
                                <p>• Try using an incognito/private window</p>
                                <p>• Consider using a different browser</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Page
                        </Button>
                        <Button variant="outline" onClick={() => setDeviceStatus('new')}>
                            <Smartphone className="w-4 h-4 mr-2" />
                            Try Registration
                        </Button>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-6">
                        When contacting support, please provide the error code: {errorCode}
                    </p>
                </div>
            </div>
        );
    }

    if (deviceStatus === 'new') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto border border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">New Device Detected</h2>
                    <Alert className="mb-6 mt-4">
                        <AlertTitle className="flex items-center font-medium">
                            <Info className="w-4 h-4 mr-2" />
                            Security Verification
                        </AlertTitle>
                        <AlertDescription>
                            TimeWise requires device verification to ensure secure access to sensitive attendance data. This is a one-time process for this device.
                        </AlertDescription>
                    </Alert>
                    <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left">
                        <h3 className="font-medium text-slate-800 mb-2">Device Information:</h3>
                        <ul className="text-sm text-slate-600 space-y-1">
                            <li>• Browser: {navigator.userAgent.split('(')[0].trim()}</li>
                            <li>• Operating System: {navigator.platform}</li>
                            <li>• Time Zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</li>
                            <li>• Screen Resolution: {window.screen.width}x{window.screen.height}</li>
                        </ul>
                    </div>
                    <Button 
                        onClick={requestApproval}
                        disabled={isRequestingApproval}
                        className="bg-emerald-600 hover:bg-emerald-700 w-full"
                    >
                        {isRequestingApproval ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Requesting Approval...
                            </>
                        ) : (
                            <>
                                <Shield className="w-4 h-4 mr-2" />
                                Request Device Approval
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    if (deviceStatus === 'pending') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto border border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">Approval Pending</h2>
                    <Alert className="mb-6 mt-4" variant="warning">
                        <AlertTitle className="flex items-center font-medium">
                            <Info className="w-4 h-4 mr-2" />
                            Administrator Review Required
                        </AlertTitle>
                        <AlertDescription>
                            Your device verification request has been submitted and is awaiting administrator approval. This typically takes 1-2 business hours.
                        </AlertDescription>
                    </Alert>
                    <div className="bg-slate-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-slate-800 mb-2">What happens next?</h3>
                        <p className="text-sm text-slate-600">
                            You'll receive an email notification when your device is approved. If you need immediate access, please contact your administrator.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Check Status
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Add fallback for missing user (after all other state checks)
    if (!user && deviceStatus !== 'error') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto border border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">Authentication Required</h2>
                    <Alert className="mb-6 mt-4" variant="warning">
                        <AlertTitle className="flex items-center font-medium">
                            <Info className="w-4 h-4 mr-2" />
                            User Information Missing
                        </AlertTitle>
                        <AlertDescription>
                            User information is required for device verification. Please log in again to continue.
                        </AlertDescription>
                    </Alert>
                    <Button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    // If approved, show children
    return children;
};

export default DeviceApprovalGate;
