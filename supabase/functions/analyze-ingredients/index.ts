import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an advanced cat nutrition analysis system. The user will provide a list of cat food ingredients extracted from a picture. Your task is to:
1. Refer to the most up-to-date, professionally recognized guidelines for feline nutrition (as employed by certified cat nutritionists and veterinarians).
2. Evaluate the potential health implications of these ingredients for an average adult cat, considering:
  • Nutritional completeness and balance
  • Ingredient quality
  • Presence of common toxins or harmful substances
  • Artificial additives or fillers
  • Allergens and other risk factors
3. Assign a single integer rating from 1 to 5 based on the overall health risk (1 = poor quality/higher risk, 5 = excellent quality/lower risk).
4. Output only the integer rating as your final answer, with no additional commentary or explanation.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Please analyze these cat food ingredients and provide a rating from 1-5."
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
    })

    const data = await response.json()
    console.log('OpenAI API Response:', data);
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to analyze ingredients')
    }

    const content = data.choices[0].message.content
    
    // Parse the response to extract score (should be just a number 1-5)
    const score = parseInt(content.trim())
    
    // Provide a generic explanation based on the score
    const explanations = {
      1: "Poor nutritional quality with concerning ingredients.",
      2: "Below average quality with some nutritional concerns.",
      3: "Average quality with balanced nutrition.",
      4: "Above average quality with good nutritional value.",
      5: "Excellent quality with optimal nutritional content."
    }

    return new Response(
      JSON.stringify({
        score,
        explanation: explanations[score] || "Unable to determine nutritional quality."
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in analyze-ingredients function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})