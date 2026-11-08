import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import { Lock, Mail, User as UserIcon, Phone, AlertCircle, ChevronLeft, Copy, ExternalLink, Check, ShieldAlert } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { loginWithEmail, registerWithEmail, resetPassword, signInWithGoogle } = useAuth();
  const { showToast } = useStore();
  const { navigateToHome } = useRouter();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(
    initialMode === 'register' ? 'signup' : 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        showToast('Signed in successfully! Welcome to ZEN TACH.', 'success');
        navigateToHome();
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, fullName, phone);
        showToast('Account registered successfully! Welcome to ZEN TACH.', 'success');
        navigateToHome();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        showToast('Password reset link sent to your email!', 'success');
        setMode('signin');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setUnauthorizedDomain(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      showToast('Signed in with Google!', 'success');
      navigateToHome();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'run.app';
        setUnauthorizedDomain(domain);
        setErrorMsg('Domain authorization required in Firebase Console.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in popup was closed before completion.');
      } else {
        setErrorMsg(err.message || 'Google Sign-in was cancelled or failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyDomain = () => {
    if (unauthorizedDomain) {
      navigator.clipboard.writeText(unauthorizedDomain);
      setCopiedDomain(true);
      showToast('Domain copied to clipboard!', 'info');
      setTimeout(() => setCopiedDomain(false), 3000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 sm:p-10 space-y-6">
        {/* Top return */}
        <button
          onClick={navigateToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src="/assets/aistudio/Zen_Tach_Smart_Tech_Logo_b93b53fb.png"
            alt="ZEN TACH"
            className="h-12 mx-auto object-contain"
          />
          <h1 className="text-xl font-black text-neutral-900">
            {mode === 'signin' && 'Sign In to ZEN TACH'}
            {mode === 'signup' && 'Create Your Customer Account'}
            {mode === 'forgot' && 'Reset Your Account Password'}
          </h1>
          <p className="text-xs text-neutral-500">
            {mode === 'signin' && 'Access your order tracking and saved items'}
            {mode === 'signup' && 'Join the premier gadget shopping platform in Bangladesh'}
            {mode === 'forgot' && 'Enter your registered email address to receive reset instructions'}
          </p>
        </div>

        {/* Mode Selector */}
        {mode !== 'forgot' && (
          <div className="flex bg-neutral-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signin' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {unauthorizedDomain && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs space-y-3 text-neutral-800 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Domain Authorization Required in Firebase</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-600">
              Google Sign-In requires your preview host to be added to Authorized Domains for project <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900">zentach</code>.
            </p>

            <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-amber-200">
              <span className="font-mono text-[11px] text-neutral-900 truncate">
                {unauthorizedDomain}
              </span>
              <button
                type="button"
                onClick={copyDomain}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedDomain ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-[11px] text-neutral-600 space-y-1">
              <p><strong>Steps to authorize:</strong></p>
              <ol className="list-decimal pl-4 space-y-0.5 text-[10.5px]">
                <li>Open Firebase Console &gt; Project <span className="font-semibold">zentach</span></li>
                <li>Go to <strong>Authentication</strong> &gt; <strong>Settings</strong> &gt; <strong>Authorized domains</strong></li>
                <li>Click <strong>Add domain</strong>, paste the domain above, and save.</li>
              </ol>
            </div>

            <div className="pt-1 border-t border-amber-200 flex items-center justify-between">
              <span className="text-[10.5px] font-medium text-amber-900">
                Or sign in with Email &amp; Password immediately below:
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('prorabbiv@gmail.com');
                  setMode('signin');
                }}
                className="text-[10px] text-amber-800 font-bold hover:underline cursor-pointer"
              >
                Use Admin Email
              </button>
            </div>
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                  />
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="01705285855"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-neutral-800 mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-neutral-800">Password *</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-[#E53935] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E53935] hover:bg-red-600 disabled:bg-neutral-300 text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer mt-2"
          >
            {loading
              ? 'Authenticating...'
              : mode === 'signin'
              ? 'Sign In to Account'
              : mode === 'signup'
              ? 'Complete Registration'
              : 'Send Reset Email'}
          </button>
        </form>

        {/* Social Authentication */}
        {mode !== 'forgot' && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-3 text-neutral-400 font-semibold">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-700 font-bold border border-neutral-300 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        )}

        {mode === 'forgot' && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-xs font-semibold text-[#E53935] hover:underline cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
