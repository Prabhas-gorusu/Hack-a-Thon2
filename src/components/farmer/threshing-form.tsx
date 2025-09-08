
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wheat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Notification } from '@/lib/types';
import { useState, useEffect } from 'react';


export default function ThreshingForm() {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<{name: string} | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const threshingType = form['threshing-type'].value;
        const quantity = form.quantity.value;
        const price = form.price.value;

        // In a real app, this would submit the listing to the backend.
        toast({
            title: "Listing Created!",
            description: "Your threshing is now available on the marketplace.",
        });

        if(currentUser) {
            const existingNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
            const newNotification: Notification = {
                id: `notif-${Date.now()}-${Math.random()}`,
                recipient: 'Retailer Joe', // Hardcoded for now, could be dynamic
                sender: currentUser.name,
                message: `New listing: ${quantity} KG of ${threshingType} available at ₹${price}/KG.`,
                timestamp: Date.now(),
                read: false,
            };
            localStorage.setItem('notifications', JSON.stringify([...existingNotifications, newNotification]));
        }

        form.reset();
    };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wheat className="text-primary" />
          Sell Post-Harvest Threshing
        </CardTitle>
        <CardDescription>List your available threshing for retailers to purchase.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="threshing-type">Type of Crop/Threshing</Label>
            <Input id="threshing-type" name="threshing-type" placeholder="e.g., Wheat Straw, Rice Husks" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (in KG)</Label>
              <Input id="quantity" name="quantity" type="number" placeholder="1000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (per KG)</Label>
              <Input id="price" name="price" type="number" placeholder="15" required />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Listing
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
