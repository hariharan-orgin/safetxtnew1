import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SignupForm: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | '',
    location: '',
    phone: '',
    gender: '',
    enableOtp: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role as UserRole,
        location: formData.location,
        phone: formData.phone,
        gender: formData.gender,
        enableOtp: formData.enableOtp,
      });
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-[#0F172A] font-medium text-sm">
            Username *
          </Label>
          <Input
            id="username"
            type="text"
            variant="auth"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-[#0F172A] font-medium text-sm">
            Email *
          </Label>
          <Input
            id="signup-email"
            type="email"
            variant="auth"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-[#0F172A] font-medium text-sm">
            Password *
          </Label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              variant="auth"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-[#0F172A] font-medium text-sm">
            Confirm *
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              variant="auth"
              placeholder="Confirm"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-role" className="text-[#0F172A] font-medium text-sm">
          Role *
        </Label>
        <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
          <SelectTrigger className="h-11 border-gray-200 bg-white text-gray-900 focus:border-accent focus:ring-2 focus:ring-accent/20">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="executive">Executive</SelectItem>
            <SelectItem value="control_room">Control Room</SelectItem>
            <SelectItem value="field_team">Field Team</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-[#0F172A] font-medium text-sm">
            Location
          </Label>
          <Input
            id="location"
            type="text"
            variant="auth"
            placeholder="City, Country"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#0F172A] font-medium text-sm">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            variant="auth"
            placeholder="+1 234 567 890"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender" className="text-[#0F172A] font-medium text-sm">
          Gender
        </Label>
        <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
          <SelectTrigger className="h-11 border-gray-200 bg-white text-gray-900 focus:border-accent focus:ring-2 focus:ring-accent/20">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
        <Label htmlFor="otp-toggle" className="text-[#0F172A] font-medium text-sm cursor-pointer">
          Enable OTP Verification
        </Label>
        <Switch
          id="otp-toggle"
          checked={formData.enableOtp}
          onCheckedChange={(checked) => handleChange('enableOtp', checked)}
        />
      </div>

      <Button
        type="submit"
        variant="auth"
        size="lg"
        className="w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default SignupForm;
