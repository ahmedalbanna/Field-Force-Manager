'use server';

/**
 * @fileOverview AI-powered suggestion of next steps for a sales visit.
 *
 * - suggestNextSteps - A function that suggests next steps for a visit based on client details and visit notes.
 * - SuggestNextStepsInput - The input type for the suggestNextSteps function.
 * - SuggestNextStepsOutput - The return type for the suggestNextSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextStepsInputSchema = z.object({
  clientDetails: z
    .string()
    .describe('Detailed information about the client, including their needs, preferences, and history.'),
  visitNotes: z
    .string()
    .describe('Notes taken during the visit, including topics discussed, agreements made, and any issues raised.'),
});
export type SuggestNextStepsInput = z.infer<typeof SuggestNextStepsInputSchema>;

const SuggestNextStepsOutputSchema = z.object({
  nextSteps: z.string().describe('A list of suggested next steps for the sales representative, tailored to the client and the visit.'),
});
export type SuggestNextStepsOutput = z.infer<typeof SuggestNextStepsOutputSchema>;

export async function suggestNextSteps(input: SuggestNextStepsInput): Promise<SuggestNextStepsOutput> {
  return suggestNextStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextStepsPrompt',
  input: {schema: SuggestNextStepsInputSchema},
  output: {schema: SuggestNextStepsOutputSchema},
  prompt: `You are an AI assistant that helps sales representatives determine the next steps after a client visit.

  Based on the following client details and visit notes, suggest the next steps for the sales representative.

  Client Details: {{{clientDetails}}}
  Visit Notes: {{{visitNotes}}}

  Consider the client's needs, preferences, and history, as well as any agreements made or issues raised during the visit.
  Provide a detailed and actionable list of next steps.
  The next step suggestions should be concrete and easily implementable.
  Focus on actions that move the sales process forward and strengthen the client relationship.
  For example, scheduling a follow-up meeting, sending additional information, or preparing a proposal.
  The response should be in a format easily readable by a sales representative.
  Prioritize clarity and actionable advice.
  Do not be verbose.
  Do not repeat the details of the visit.
  Just suggest next steps.
  Be brief and to the point.
  Assume the sales representative is very busy and values brevity.
  Do not be creative or try to sell anything. Focus on the concrete next steps.
  Here's an example:
  Next Steps:
  - Schedule a follow-up meeting to discuss the proposal.
  - Send additional information about the product.
  - Prepare a detailed proposal.
  - Do not add any introduction or conclusion.
  Do not add any pleasantries. 
  The content of the next steps is very important.
  Do not make up information.
  If no next steps can be determined, say 'No next steps can be determined.'
  Each next step should be actionable, meaning it can be done immediately.
  Each next step should be achievable, meaning it can be easily done with the sales rep's resources.
  Do not suggest impossible or impractical steps.
  Return the result.
  Do not write introduction or conclusion.
`,
});

const suggestNextStepsFlow = ai.defineFlow(
  {
    name: 'suggestNextStepsFlow',
    inputSchema: SuggestNextStepsInputSchema,
    outputSchema: SuggestNextStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
