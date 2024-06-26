import {
	generateObject,
	jsonObjectPrompt,
	ollama,
	zodSchema,
} from "modelfusion";
import { z } from "zod";

const formatDomain = (str: string) =>
	str
		.split(".")[0]
		.replace(/[^a-zа-я0-9]/gi, "")
		.toLowerCase();

export const ollamaGenerateNames = async (
	prompt: string,
	opts: { minLength: number; maxLength: number; quantity: number },
) => {
	const { names } = await generateObject({
		model: ollama
			.ChatTextGenerator({
				model: "llama3",
			})
			.asObjectGenerationModel(jsonObjectPrompt.text()),
		schema: zodSchema(
			z.object({
				names: z.array(
					z.object({
						ru: z.string(),
						en: z.string(),
					}),
				),
			}),
		),
		prompt: `List ${opts.quantity} brand names for a website with following description: "${prompt}". Each name should be of length from ${opts.minLength} to ${opts.maxLength}. Write english and russian variant for each name.`,
	});

	return names.map(({ ru, en }) => ({
		ru: formatDomain(ru),
		en: formatDomain(en),
	}));
};
