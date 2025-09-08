'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import OtpInput from '@/components/auth/otp-input';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const router = useRouter();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API to send an OTP
    toast({
      title: 'OTP Sent',
      description: 'An OTP has been sent to your contact number.',
    });
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would verify the OTP and update the password
    toast({
      title: 'Password Reset Successful',
      description: 'You can now log in with your new password.',
    });
    router.push('/login');
  };

  if (step === 1) {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number</Label>
          <Input id="contact" type="tel" placeholder="+91 00000 00000" required />
        </div>
        <Button type="submit" className="w-full">
          Send OTP
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <OtpInput length={6} onComplete={(otp) => console.log('OTP Entered:', otp)} />
      </div>

       <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input id="new-password" type="password" required />
      </div>

       <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input id="confirm-password" type="password" required />
      </div>

      <Button type="submit" className="w-full">
        Reset Password
      </Button>
    </form>
  );
}
