import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  if (!process.env.API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API_KEY environment variable not set on the server.' }),
    };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: process.env.API_KEY }),
  };
};
