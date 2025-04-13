
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Lock, User, ArrowRight, Play, EyeOff, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/ui/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Auth = () => {
  // Email auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Get tab from URL query params
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const defaultTab = tabParam === 'signup' ? 'signup' : 'login';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email for the confirmation link",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDemo = () => {
    navigate('/?demo=true');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-regime-dark to-regime-dark-light p-4 md:p-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <Logo size={isMobile ? "md" : "lg"} withText className="mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to REGIME</h1>
          <p className="text-gray-300 italic">Your personal fitness journey begins here</p>
        </div>
        
        <Card className="mb-6 border-none glass-card-dark animate-scale-up hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <Button 
              onClick={handleViewDemo} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold transition-all duration-300 flex items-center justify-center h-12"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Demo - No Login Required
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-lg overflow-hidden animate-slide-up bg-white/5 backdrop-blur-lg">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-none bg-white/10">
              <TabsTrigger value="login" className="data-[state=active]:bg-regime-green data-[state=active]:text-regime-dark py-3">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-regime-green data-[state=active]:text-regime-dark py-3">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="p-6 space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Sign in to continue your fitness journey</p>
              </div>
              
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-white/10 border-white/20 text-white"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-regime-green" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-white">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-regime-green" />
                    <button 
                      type="button" 
                      onClick={toggleShowPassword} 
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-regime-green hover:bg-regime-green-light text-regime-dark font-medium transition-all duration-300 hover:shadow-lg hover:shadow-regime-green/20 h-12" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="p-6 space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-white">Create Account</h2>
                <p className="text-gray-400 text-sm">Join REGIME and start your fitness journey</p>
              </div>
              
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white"
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-regime-green" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-white/10 border-white/20 text-white"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-regime-green" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-regime-green" />
                    <button 
                      type="button" 
                      onClick={toggleShowPassword} 
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-regime-green hover:bg-regime-green-light text-regime-dark font-medium transition-all duration-300 hover:shadow-lg hover:shadow-regime-green/20 h-12" 
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-8 text-center text-white/70 text-sm animate-fade-in">
          <p>By continuing, you agree to REGIME's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
