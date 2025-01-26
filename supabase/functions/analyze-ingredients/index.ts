import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a cat nutrition expert. Analyze cat food ingredients and provide a health score from 1-10, where 10 is the healthiest. Also provide a brief explanation of the score. Return the response in JSON format with "score" and "explanation" fields.'
          },
          {
            role: 'user',
            content: `Analyze these cat food ingredients and provide a health score: ${ingredients}`
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);

    let result;
    try {
      // Try to parse the response as JSON
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // If parsing fails, create a structured response from the raw text
      const content = data.choices[0].message.content;
      result = {
        score: parseInt(content.match(/\d+/)[0]) || 5,
        explanation: content
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-ingredients function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});