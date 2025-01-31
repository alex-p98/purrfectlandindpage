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
    // Get and validate request body
    const body = await req.json()
    
    if (!body?.image) {
      throw new Error('No image data provided')
    }

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
            content: `You are an advanced cat nutrition analysis system. Analyze the ingredients list from the image and:
1. Check for harmful ingredients or red flags
2. Evaluate nutritional completeness
3. Consider common allergens
4. Look for artificial additives
5. Assess protein quality and sources
Then provide:
1. A score from 1-5 (1=poor, 5=excellent)
2. A brief explanation of the rating`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Please analyze these cat food ingredients and provide a rating from 1-5 with a brief explanation."
              },
              {
                type: 'image_url',
                image_url: {
                  url: body.image
                }
              }
            ]
          }
        ],
        max_tokens: 500
      }),
    })

    const data = await response.json()
    console.log('OpenAI API Response:', data)
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to analyze ingredients')
    }

    // Extract score and explanation from the response
    const content = data.choices[0].message.content
    const scoreMatch = content.match(/(\d+)/)
    const score = scoreMatch ? parseInt(scoreMatch[0]) : null
    
    if (!score || score < 1 || score > 5) {
      throw new Error('Invalid score received from analysis')
    }

    // Extract explanation (everything after the score)
    const explanation = content.replace(/^[^a-zA-Z]+/, '').trim()

    return new Response(
      JSON.stringify({
        score,
        explanation
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in analyze-ingredients function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})