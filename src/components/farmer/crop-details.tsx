'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Crop } from '@/lib/types';
import { Calendar, Sun, Droplets, FlaskConical, X } from 'lucide-react';

type CropDetailsProps = {
  crop: Crop;
  onClear: () => void;
};

export default function CropDetails({ crop, onClear }: CropDetailsProps) {
  return (
    <Card className="h-full relative">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClear}>
        <X className="h-4 w-4"/>
        <span className="sr-only">Clear selection</span>
      </Button>
      <CardHeader>
        <CardTitle className="font-headline">{crop.name} Details</CardTitle>
        <CardDescription>Key information for growing {crop.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 text-sm">
          <DetailItem icon={<Calendar className="text-primary"/>} label="Growth Period" value={crop.details.growthPeriod} />
          <DetailItem icon={<Sun className="text-primary"/>} label="Weather Needs" value={crop.details.weatherNeeds} />
          <DetailItem icon={<Droplets className="text-primary"/>} label="Irrigation Needs" value={crop.details.irrigationNeeds} />
          <DetailItem icon={<FlaskConical className="text-primary"/>} label="Fertilizer Recs" value={crop.details.fertilizerRecs} />
          <DetailItem icon={<Calendar className="text-primary"/>} label="Harvest Prediction" value={crop.details.harvestPrediction} />
        </ul>
      </CardContent>
    </Card>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex-shrink-0 w-5 h-5">{icon}</div>
      <div>
        <span className="font-semibold">{label}:</span>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </li>
  );
}
