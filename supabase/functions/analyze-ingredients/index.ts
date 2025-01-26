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
            content: `You are a cat nutrition expert. Analyze the ingredients in cat food images and provide:
              1. A health score from 1-10
              2. A brief explanation of the score
              Focus on nutritional value, quality of ingredients, and presence of fillers or harmful additives.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Please analyze these cat food ingredients and provide a health score out of 10 along with a brief explanation."
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
        max_tokens: 500
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to analyze ingredients')
    }

    const content = data.choices[0].message.content
    
    // Parse the response to extract score and explanation
    const scoreMatch = content.match(/(\d+)\/10|(\d+)\s*out of\s*10/)
    const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 5
    
    // Remove the score from the content to get just the explanation
    const explanation = content.replace(/(\d+)\/10|(\d+)\s*out of\s*10/, '').trim()

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
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})