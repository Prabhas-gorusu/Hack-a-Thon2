// 'use server';

/**
 * @fileOverview Provides AI-powered crop suggestions for farmers based on soil type, land location, and local crop history.
 *
 * - suggestCrops - A function that suggests the best crops to plant.
 * - SuggestCropsInput - The input type for the suggestCrops function.
 * - SuggestCropsOutput - The return type for the suggestCrops function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCropsInputSchema = z.object({
  soilType: z
    .string()
    .describe("The type of soil on the farmer's land (e.g., clay, loam, sandy)."),
  landLocation: z
    .string()
    .describe("The GPS coordinates or map-based location of the farmer's land."),
  nearbyCropHistory: z
    .string()
    .describe("A summary of the crop history of nearby farms."),
});
export type SuggestCropsInput = z.infer<typeof SuggestCropsInputSchema>;

const SuggestCropsOutputSchema = z.object({
  cropSuggestions: z
    .array(z.string())
    .describe("A list of exactly 5 crop suggestions."),
});
export type SuggestCropsOutput = z.infer<typeof SuggestCropsOutputSchema>;

export async function suggestCrops(input: SuggestCropsInput): Promise<SuggestCropsOutput> {
  return suggestCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCropsPrompt',
  input: {schema: SuggestCropsInputSchema},
  output: {schema: SuggestCropsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided soil type, land location, and crop history of nearby farms, suggest exactly 5 of the best crops for the farmer to plant.

Soil Type: {{{soilType}}}
Land Location: {{{landLocation}}}
Nearby Crop History: {{{nearbyCropHistory}}}

Consider both best-fit crops and popular crops in the locality. You must provide 5 crop names.

Output the crop suggestions as a list of strings.
`,
});

const suggestCropsFlow = ai.defineFlow(
  {
    name: 'suggestCropsFlow',
    inputSchema: SuggestCropsInputSchema,
    outputSchema: SuggestCropsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
