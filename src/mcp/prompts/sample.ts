import { z } from 'zod'
import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { PromptDefinition } from '../types.js'

export const samplePrompts: PromptDefinition[] = [
  {
    name: 'greeting',
    config: {
      title: 'Greeting Prompt',
      description: 'A customizable greeting prompt',
      argsSchema: {
        name: z.string().describe('Name to include in the greeting'),
        language: z
          .enum(['en', 'ja', 'es', 'fr'])
          .describe('Language for the greeting'),
      },
    },
    handler: async (
      args: {
        name?: string
        language?: string
      } = {}
    ): Promise<GetPromptResult> => {
      const { name = 'World', language = 'en' } = args

      const instructions = {
        en: `Please greet ${name} in a friendly and warm manner. Make the greeting personal and welcoming.`,
        ja: `${name}さんに対して、親しみやすく温かい挨拶をしてください。個人的で歓迎的な挨拶にしてください。`,
        es: `Por favor saluda a ${name} de manera amigable y cálida. Haz que el saludo sea personal y acogedor.`,
        fr: `Veuillez saluer ${name} de manière amicale et chaleureuse. Rendez la salutation personnelle et accueillante.`,
      }

      const instruction =
        instructions[language as keyof typeof instructions] || instructions.en

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: instruction,
            },
          },
        ],
      }
    },
  },
]
