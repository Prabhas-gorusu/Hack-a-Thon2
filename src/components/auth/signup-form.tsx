'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OtpInput from '@/components/auth/otp-input';

type SignupFormProps = {
  role: 'farmer' | 'retailer';
};

export default function SignupForm({ role }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactNumber(e.currentTarget.contact_number.value);
     // In a real app, you would call an API to send an OTP
    toast({
      title: 'OTP Sent',
      description: 'An OTP has been sent to your contact number.',
    });
    setStep(2);
  };
  
  const handleResendOtp = () => {
    // In a real app, you would call an API to send a new OTP
     toast({
      title: 'OTP Resent',
      description: 'A new OTP has been sent to your contact number.',
    });
  }

  const handleCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     // In a real app, you would verify the OTP and create the account
    const form = e.currentTarget;
    const user = {
        name: form.name.value,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        contact: "+91 " + contactNumber,
        location: role === 'farmer' ? form.location.value : form.shop_location.value,
    }
    localStorage.setItem('user', JSON.stringify(user));
    router.push(`/${role}/dashboard`);
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // You can use a reverse geocoding service here to get address from lat/lng
          setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          toast({
            title: 'Location Detected',
            description: 'Your location has been filled in.',
          });
        },
        (error) => {
          toast({
            title: 'Location Error',
            description: 'Could not detect location. Please enter it manually.',
            variant: 'destructive',
          });
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast({
        title: 'Location Not Supported',
        description: 'Your browser does not support geolocation.',
        variant: 'destructive',
      });
    }
  };

  if (step === 1) {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number</Label>
          <Input id="contact" name="contact_number" type="tel" placeholder="98765 43210" required />
        </div>
        <Button type="submit" className="w-full">
          Send OTP
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleCreateAccount} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <OtpInput length={6} onComplete={(otp) => console.log('OTP Entered:', otp)} />
        <p className="text-xs text-center text-muted-foreground pt-2">
            Didn't receive OTP? <button type="button" className="underline" onClick={handleResendOtp}>Resend</button>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="John Doe" required />
      </div>

      {role === 'farmer' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="location">Agriculture Land Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                name="location"
                placeholder="Enter GPS coordinates or address"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleDetectLocation} aria-label="Detect Location">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="soil-type">Soil Type</Label>
            <Select name="soilType" required>
              <SelectTrigger id="soil-type">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="loam">Loam</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
                <SelectItem value="chalky">Chalky</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {role === 'retailer' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="company-name">Shop/Company Name</Label>
            <Input id="company-name" name="companyName" placeholder="Green Grocers Inc." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shop-location">Shop Location</Label>
            <Input id="shop-location" name="shop_location" placeholder="Enter shop address" required />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Set Password</Label>
        <Input id="password" type="password" required />
      </div>

      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  );
}
