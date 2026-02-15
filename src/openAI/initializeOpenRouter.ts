import { OpenRouter } from '@openrouter/sdk';

export let openRouter: OpenRouter;

export const initializeOpenRouter = async (openAIKey: string) => {
  try {
    openRouter = new OpenRouter({
      apiKey: openAIKey,
    });
  } catch (err) {
    console.error('Ошибка подключения:', err);
  }
};
