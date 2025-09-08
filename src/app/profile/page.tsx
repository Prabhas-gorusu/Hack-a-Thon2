
'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/shared/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, Save, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type UserData = {
  name: string;
  role: 'Farmer' | 'Retailer';
  contact: string;
  location: string;
};

const defaultUserData: UserData = {
  name: '',
  role: 'Farmer',
  contact: '',
  location: '',
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(userData));
    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved successfully.',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen">
         <DashboardHeader role={'Farmer'} /> 
          <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
          </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader role={userData.role as 'Farmer' | 'Retailer'} />
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <User className="text-primary"/>
                    User Profile
                </CardTitle>
                <CardDescription>View and edit your account details.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="h-4 w-4"/> : <Edit className="h-4 w-4"/>}
                <span className="sr-only">{isEditing ? 'Save' : 'Edit'}</span>
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={userData.name} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" name="role" value={userData.role} disabled />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input id="contact" name="contact" value={userData.contact} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={userData.location} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                {isEditing && (
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Save Changes</Button>
                    </div>
                )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
