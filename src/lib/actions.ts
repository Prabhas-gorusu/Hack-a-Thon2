
'use server';

import { suggestCrops } from '@/ai/flows/suggest-crops';
import type { SuggestCropsInput, SuggestCropsOutput } from '@/ai/flows/suggest-crops';
import { suggestPesticides } from '@/ai/flows/suggest-pesticides';
import type { SuggestPesticidesInput, SuggestPesticidesOutput } from '@/ai/flows/suggest-pesticides';
import { diagnosePlantHealth } from '@/ai/flows/diagnose-plant-health';
import type { DiagnosePlantHealthInput } from '@/ai/flows/diagnose-plant-health';
import { getCropDetails as getCropDetailsFlow } from '@/ai/flows/get-crop-details';
import { z } from 'zod';
import { ZodError } from 'zod';

// Define state for server actions
export type FormState = {
  status: 'success' | 'error' | 'idle';
  message: string;
  data?: any;
};


// Zod schemas for input validation
const cropSuggestionSchema = z.object({
  soilType: z.string().min(1, 'Soil type is required.'),
  landLocation: z.string().min(1, 'Land location is required.'),
  nearbyCropHistory: z.string().min(1, 'Nearby crop history is required.'),
});

const pesticideSuggestionSchema = z.object({
  crop: z.string().min(1, 'Crop name is required.'),
  pests: z.string().min(1, 'Pest information is required.'),
});

const imagePesticideSuggestionSchema = z.object({
    photo: z.any(),
    description: z.string().optional(),
});

const cropDetailsSchema = z.string().min(1, 'Crop name is required.');


export async function getCropSuggestions(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      soilType: formData.get('soilType'),
      landLocation: formData.get('landLocation'),
      nearbyCropHistory: formData.get('nearbyCropHistory'),
    };
    const input: SuggestCropsInput = cropSuggestionSchema.parse(rawData);
    
    const result = await suggestCrops(input);
    
    return { status: 'success', message: 'Suggestions generated successfully.', data: result };
  } catch (error) {
    if (error instanceof ZodError) {
       return { status: 'error', message: error.errors.map(e => e.message).join(', ') };
    }
    console.error("Error in getCropSuggestions:", error);
    return { status: 'error', message: 'An unexpected server error occurred. Please try again.' };
  }
}

export async function getPesticideSuggestions(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
     const rawData = {
      crop: formData.get('crop'),
      pests: formData.get('pests'),
    };
    const input: SuggestPesticidesInput = pesticideSuggestionSchema.parse(rawData);

    const result = await suggestPesticides(input);

    return { status: 'success', message: 'Suggestions generated successfully.', data: result };
  } catch (error) {
    if (error instanceof ZodError) {
       return { status: 'error', message: error.errors.map(e => e.message).join(', ') };
    }
    console.error("Error in getPesticideSuggestions:", error);
    return { status: 'error', message: 'An unexpected server error occurred. Please try again.' };
  }
}


function toDataURI(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function getPesticideSuggestionsFromImage(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      photo: formData.get('photo'),
      description: formData.get('description'),
    };
    const parsed = imagePesticideSuggestionSchema.parse(rawData);

    if (!parsed.photo || parsed.photo.size === 0) {
      return { status: 'error', message: 'An image file is required.' };
    }
    
    const imageFile = parsed.photo as File;
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const photoDataUri = toDataURI(imageBuffer, imageFile.type);


    const input: DiagnosePlantHealthInput = {
        photoDataUri,
        description: parsed.description || 'No description provided.',
    };
    
    const result = await diagnosePlantHealth(input);
    
    return { status: 'success', message: 'Image analyzed and suggestions generated.', data: result };
  } catch (error) {
     if (error instanceof ZodError) {
       return { status: 'error', message: error.errors.map(e => e.message).join(', ') };
    }
    console.error("Error in getPesticideSuggestionsFromImage:", error);
    return { status: 'error', message: 'An unexpected error occurred while processing the image.' };
  }
}

export async function getCropDetails(cropName: string): Promise<FormState> {
    try {
        const validatedCropName = cropDetailsSchema.parse(cropName);
        const result = await getCropDetailsFlow({ cropName: validatedCropName });
        return { status: 'success', message: 'Crop details fetched.', data: result };
    } catch (error) {
        if (error instanceof ZodError) {
            return { status: 'error', message: error.errors.map(e => e.message).join(', ') };
        }
        console.error("Error in getCropDetails:", error);
        return { status: 'error', message: 'Failed to fetch crop details. Please try again.' };
    }
}
