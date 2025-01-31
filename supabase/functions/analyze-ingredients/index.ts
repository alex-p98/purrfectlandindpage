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
    if (!image) {
      throw new Error('No image provided')
    }
    
    console.log('Received image data, calling OpenAI API...');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
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

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text()
      console.error('OpenAI API Error:', errorData)
      throw new Error(`OpenAI API error: ${errorData}`)
    }

    const openAIData = await openAIResponse.json()
    console.log('OpenAI API Response:', JSON.stringify(openAIData))
    
    if (!openAIData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI')
    }

    // Extract and validate the score
    const content = openAIData.choices[0].message.content.trim()
    const score = parseInt(content)
    
    if (isNaN(score) || score < 1 || score > 5) {
      console.error('Invalid score received:', content)
      throw new Error('Invalid score received from OpenAI')
    }
    
    // Provide a generic explanation based on the score
    const explanations = {
      1: "Poor nutritional quality with concerning ingredients.",
      2: "Below average quality with some nutritional concerns.",
      3: "Average quality with balanced nutrition.",
      4: "Above average quality with good nutritional value.",
      5: "Excellent quality with optimal nutritional content."
    }

    const response = {
      score,
      explanation: explanations[score] || "Unable to determine nutritional quality."
    }

    console.log('Sending response:', JSON.stringify(response))

    return new Response(
      JSON.stringify(response),
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