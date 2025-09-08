
'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/shared/dashboard-header';
import WeatherDisplay from '@/components/farmer/weather-display';
import CropPrediction from '@/components/farmer/crop-prediction';
import PesticideSuggestion from '@/components/farmer/pesticide-suggestion';
import ThreshingForm from '@/components/farmer/threshing-form';
import CropDetails from '@/components/farmer/crop-details';
import type { Crop } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { getCropDetails as fetchCropDetailsAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function FarmerDashboard() {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isLoadingCropDetails, setIsLoadingCropDetails] = useState(false);
  const { toast } = useToast();


  const handleSelectCrop = async (cropName: string) => {
    setIsLoadingCropDetails(true);
    setSelectedCrop(null); // Clear previous selection immediately

    const { data, message, status } = await fetchCropDetailsAction(cropName);

    if (status === 'success' && data) {
      setSelectedCrop(data);
    } else {
      toast({
        title: 'Error fetching crop details',
        description: message,
        variant: 'destructive',
      });
      setSelectedCrop(null); // Ensure selection is cleared on error
    }
    setIsLoadingCropDetails(false);
  };

  const clearSelection = () => {
    setSelectedCrop(null);
  }

  const renderContent = () => {
    if (isLoadingCropDetails) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <CardSkeleton />
        </motion.div>
      );
    }
    if (selectedCrop) {
      return (
        <motion.div
          key={selectedCrop.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <CropDetails crop={selectedCrop} onClear={clearSelection} />
        </motion.div>
      );
    }
    return (
      <motion.div
        key="placeholder"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <div className="h-full rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center p-6 text-center text-muted-foreground">
          <p>Select a crop from the suggestions to see its details here.</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader role="Farmer" />
      <main className="flex-1 p-4 md:p-6 grid gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-3 xl:col-span-4">
          <WeatherDisplay />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-3 xl:col-span-2">
          <CropPrediction onSelectCrop={handleSelectCrop} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-3 xl:col-span-2">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="lg:col-span-2 xl:col-span-2">
          <PesticideSuggestion />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="lg:col-span-1 xl:col-span-2">
          <ThreshingForm />
        </motion.div>

      </main>
    </div>
  );
}


function CardSkeleton() {
    return (
        <div className="p-6 h-full rounded-lg border space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
                 <div className="flex gap-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
                 <div className="flex gap-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
                 <div className="flex gap-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
                 <div className="flex gap-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
            </div>
        </div>
    )
}
