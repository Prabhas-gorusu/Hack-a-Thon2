
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCropSuggestions } from '@/lib/actions';
import { Leaf, Bot, Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FormState } from '@/lib/types';


const initialFormState: FormState = {
  status: 'idle',
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
      Get Crop Suggestions
    </Button>
  );
}

export default function CropPrediction({ onSelectCrop }: { onSelectCrop: (cropName: string) => void }) {
  const [state, formAction, isPending] = useActionState(getCropSuggestions, initialFormState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: "Suggestions Ready!",
        description: state.message,
      });
      setLocation('');
      setSoilType('');
      formRef.current?.reset();
    } else if (state.status === 'error') {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

   const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
                const city = data.address.city || data.address.town || data.address.village;
                const stateName = data.address.state;
                if(city && stateName) {
                    setLocation(`${city}, ${stateName}`);
                     toast({
                        title: 'Location Detected',
                        description: 'Your location has been filled in.',
                    });
                } else {
                     throw new Error('Could not determine city and state');
                }
            }).catch(() => {
                 setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                 toast({
                    title: 'Location Detected',
                    description: 'Coordinates filled. Could not find city/state.',
                });
            })
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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Leaf className="text-primary" />
          AI Crop Prediction
        </CardTitle>
        <CardDescription>Enter your farm's details to get AI-powered crop recommendations.</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <Select name="soilType" required value={soilType} onValueChange={setSoilType} disabled={isPending}>
              <SelectTrigger id="soilType">
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
          <div className="space-y-2">
            <Label htmlFor="landLocation">Land Location (City, State)</Label>
             <div className="flex gap-2">
              <Input
                id="landLocation"
                name="landLocation"
                placeholder="e.g., Fresno, California"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isPending}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleDetectLocation} aria-label="Detect Location" disabled={isPending}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nearbyCropHistory">Nearby Crop History</Label>
            <Input id="nearbyCropHistory" name="nearbyCropHistory" placeholder="e.g., Almonds, Grapes, Cotton" required disabled={isPending}/>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <SubmitButton />
        </CardFooter>
      </form>
      <div className="p-6 pt-0 flex-grow">
        {!isPending && state.status === 'success' && state.data?.cropSuggestions && (
          <div>
            <h3 className="font-semibold mb-2">Top 5 Suggestions:</h3>
            <ul className="space-y-2">
              {state.data.cropSuggestions.map((crop: string, index: number) => (
                <li key={index}>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => onSelectCrop(crop)}>
                        <Leaf className="mr-2 h-4 w-4 text-primary"/>
                        {crop}
                    </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
