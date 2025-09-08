'use server';
/**
 * @fileOverview Provides AI-powered crop details.
 *
 * - getCropDetails - A function that returns details for a given crop.
 * - GetCropDetailsInput - The input type for the getCropDetails function.
 * - GetCropDetailsOutput - The return type for the getCropDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCropDetailsInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
});
export type GetCropDetailsInput = z.infer<typeof GetCropDetailsInputSchema>;

const GetCropDetailsOutputSchema = z.object({
    name: z.string().describe("The name of the crop."),
    details: z.object({
        growthPeriod: z.string().describe("The typical growth period for the crop."),
        weatherNeeds: z.string().describe("The ideal weather conditions for the crop."),
        irrigationNeeds: z.string().describe("The irrigation requirements for the crop."),
        fertilizerRecs: z.string().describe("Fertilizer recommendations for the crop."),
        harvestPrediction: z.string().describe("The predicted harvest time or season."),
    })
});
export type GetCropDetailsOutput = z.infer<typeof GetCropDetailsOutputSchema>;


export async function getCropDetails(input: GetCropDetailsInput): Promise<GetCropDetailsOutput> {
  return getCropDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCropDetailsPrompt',
  input: {schema: GetCropDetailsInputSchema},
  output: {schema: GetCropDetailsOutputSchema},
  prompt: `You are an expert agricultural advisor. For the given crop, "{{cropName}}", provide its detailed information.
Fill out all the fields in the output schema.
`,
});

const getCropDetailsFlow = ai.defineFlow(
  {
    name: 'getCropDetailsFlow',
    inputSchema: GetCropDetailsInputSchema,
    outputSchema: GetCropDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
