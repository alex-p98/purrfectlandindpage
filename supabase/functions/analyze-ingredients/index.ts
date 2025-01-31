import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Log the raw request for debugging
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    // Parse JSON after logging
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body',
          details: error.message,
          receivedBody: rawBody
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate image data
    const { image } = body;
    if (!image) {
      return new Response(
        JSON.stringify({ 
          error: 'No image provided',
          receivedBody: body 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Image data received, length:', image.length);
    console.log('Calling OpenAI API...');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an advanced cat nutrition analysis system. Analyze the ingredients list in the image and:
1. Check for quality of ingredients (meat content, fillers, artificial additives)
2. Look for potential allergens or harmful ingredients
3. Assess overall nutritional balance
4. Consider preservatives and additives
5. Rate on a scale of 1-5 (1=poor, 5=excellent)
Provide ONLY the numerical score (1-5) as your response.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Analyze these cat food ingredients and provide a rating from 1-5."
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 10
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI API Response:', JSON.stringify(openAIData));
    
    if (!openAIData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Extract and validate the score
    const content = openAIData.choices[0].message.content.trim();
    const score = parseInt(content);
    
    if (isNaN(score) || score < 1 || score > 5) {
      console.error('Invalid score received:', content);
      throw new Error('Invalid score received from OpenAI');
    }
    
    // Provide explanations based on the score
    const explanations = {
      1: "Poor nutritional quality with concerning ingredients.",
      2: "Below average quality with some nutritional concerns.",
      3: "Average quality with balanced nutrition.",
      4: "Above average quality with good nutritional value.",
      5: "Excellent quality with optimal nutritional content."
    } as const;

    const response = {
      score,
      explanation: explanations[score as keyof typeof explanations] || "Unable to determine nutritional quality."
    };

    console.log('Sending response:', JSON.stringify(response));

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in analyze-ingredients function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});