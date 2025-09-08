
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<'farmer' | 'retailer' | null>(null);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast({
        title: 'Role not selected',
        description: 'Please select whether you are a Farmer or a Retailer.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, you'd get this from your auth response
    const user = {
        name: role === 'farmer' ? 'Srinivas' : 'Retailer Joe',
        role: role.charAt(0).toUpperCase() + role.slice(1),
        contact: (e.target as HTMLFormElement).contact.value,
        location: role === 'farmer' ? 'Anantapur, Andhra Pradesh' : 'Retail Hub, Main Street'
    };

    localStorage.setItem('user', JSON.stringify(user));

    router.push(`/${role}/dashboard`);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label>I am a:</Label>
        <RadioGroup onValueChange={(value) => setRole(value as 'farmer' | 'retailer')} className="flex gap-4">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="farmer" id="farmer" />
                <Label htmlFor="farmer">Farmer</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="retailer" id="retailer" />
                <Label htmlFor="retailer">Retailer</Label>
            </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Contact Number</Label>
        <Input id="contact" name="contact" type="tel" placeholder="+91 98765 43210" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input id="password" type="password" required />
      </div>
      <Button type="submit" className="w-full">
        Log In
      </Button>
    </form>
  );
}
