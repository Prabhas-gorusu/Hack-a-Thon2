
'use client';

import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/shared/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ChangePasswordPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [userRole, setUserRole] = useState<'Farmer' | 'Retailer'>('Farmer');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserRole(user.role);
        } else {
            // Redirect to login if no user is found
            router.push('/login');
        }
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const newPassword = form.new_password.value;
        const confirmPassword = form.confirm_password.value;

        if (newPassword !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'New passwords do not match.',
                variant: 'destructive',
            });
            return;
        }

        // In a real app, you would call an API to update the password.
        toast({
            title: 'Success',
            description: 'Your password has been changed successfully.',
        });
        
        router.push(`/${userRole.toLowerCase()}/dashboard`);
    };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader role={userRole} />
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Lock className="text-primary"/>
                Change Password
            </CardTitle>
            <CardDescription>Update your account password here.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="old_password">Old Password</Label>
                    <Input id="old_password" name="old_password" type="password" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input id="new_password" name="new_password" type="password" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input id="confirm_password" name="confirm_password" type="password" required />
                </div>
                <div className="flex justify-end pt-4">
                    <Button type="submit">Update Password</Button>
                </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
