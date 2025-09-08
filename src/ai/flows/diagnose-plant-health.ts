'use server';

/**
 * @fileOverview Provides AI-powered plant health diagnosis from an image.
 *
 * - diagnosePlantHealth - A function that suggests pesticides based on an image.
 * - DiagnosePlantHealthInput - The input type for the diagnosePlantHealth function.
 * - DiagnosePlantHealthOutput - The return type for the diagnosePlantHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('An optional description of the plant or its symptoms.'),
});
export type DiagnosePlantHealthInput = z.infer<typeof DiagnosePlantHealthInputSchema>;

const DiagnosePlantHealthOutputSchema = z.object({
  pesticideSuggestions: z.array(z.string()).describe('A list of pesticide suggestions.'),
  reasoning: z.string().describe('The reasoning behind the pesticide suggestions, including the identified pest/disease.'),
});
export type DiagnosePlantHealthOutput = z.infer<typeof DiagnosePlantHealthOutputSchema>;


export async function diagnosePlantHealth(input: DiagnosePlantHealthInput): Promise<DiagnosePlantHealthOutput> {
  return diagnosePlantHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantHealthPrompt',
  input: {schema: DiagnosePlantHealthInputSchema},
  output: {schema: DiagnosePlantHealthOutputSchema},
  prompt: `You are an expert agricultural advisor and botanist specializing in diagnosing plant illnesses from images. Your task is to act like a search engine.

Analyze the provided image and description to identify any pests or diseases affecting the plant. Based on your diagnosis, suggest appropriate pesticides to treat the issue.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Provide a list of suggested pesticides and a clear reasoning for your suggestions, explaining what you identified in the image. If the image is not clear or not a plant, state that.
`,
});

const diagnosePlantHealthFlow = ai.defineFlow(
  {
    name: 'diagnosePlantHealthFlow',
    inputSchema: DiagnosePlantHealthInputSchema,
    outputSchema: DiagnosePlantHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
