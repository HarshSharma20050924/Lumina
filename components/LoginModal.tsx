import React, { useState } from 'react';
import { useStore } from '../store';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginModal = () => {
  const { isLoginOpen, toggleLoginModal, login } = useStore();
  const [view, setView] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, name);
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isLoginOpen} onClose={() => toggleLoginModal(false)}>
      <div className="flex flex-col h-full">
        {/* Header Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setView('signin')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              view === 'signin' 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setView('signup')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              view === 'signup' 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.form
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {view === 'signin' ? 'Welcome back' : 'Create an account'}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {view === 'signin' 
                    ? 'Enter your details to access your account' 
                    : 'Join us to get exclusive offers and tracking'}
                </p>
              </div>

              {view === 'signup' && (
                <Input 
                  label="Full Name" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              
              <Input 
                type="email" 
                label="Email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Input 
                type="password" 
                label="Password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {view === 'signin' && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-primary-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full mt-4" size="lg" isLoading={isLoading}>
                {view === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" size="sm">
                  Google
                </Button>
                <Button type="button" variant="outline" size="sm">
                  Apple
                </Button>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};