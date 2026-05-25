/* Netlify Function: identify-exercise
 * Proxies image-to-exercise identification through Anthropic's API.
 * The API key is read from the ANTHROPIC_API_KEY environment variable
 * set in Netlify's site settings, so it never reaches the browser.
 */

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured on the server.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { imageBase64, mimeType } = body;
  if (!imageBase64 || !mimeType) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing imageBase64 or mimeType' }) };
  }

  // Basic size limit guard (5MB after base64 = ~3.75MB binary). Netlify default body limit is 6MB.
  if (imageBase64.length > 5_000_000) {
    return { statusCode: 413, body: JSON.stringify({ error: 'Image too large. Use a smaller photo.' }) };
  }

  const prompt = `You are looking at a photo of gym equipment, a fitness machine, free weights, or a person performing an exercise. Identify the primary exercise this image represents.

Respond with ONLY a JSON object (no markdown, no preamble, no commentary):
{"exerciseName": "...", "bodyPart": "chest|back|shoulders|arms|legs|core", "confidence": "high|medium|low"}

Rules:
- exerciseName should be the most common gym name for this exercise (e.g. "Lat Pulldown", "Leg Press", "Cable Fly")
- bodyPart must be exactly one of: chest, back, shoulders, arms, legs, core
- If you genuinely can't tell what this is, set confidence to "low" and return your best guess
- Do not output anything except the JSON object`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: 502,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Upstream API error', detail: errText.slice(0, 500) }),
      };
    }

    const result = await response.json();
    const raw = (result.content || []).map((b) => b.text || '').join('').trim();
    const clean = raw.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      return {
        statusCode: 502,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Could not parse model output', raw: clean.slice(0, 200) }),
      };
    }

    if (!parsed.exerciseName || !parsed.bodyPart || !parsed.confidence) {
      return {
        statusCode: 502,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Incomplete model output', got: parsed }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(parsed),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Server error', message: String(e).slice(0, 200) }),
    };
  }
};
