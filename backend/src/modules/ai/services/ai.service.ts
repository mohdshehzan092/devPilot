import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private readonly configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async generateBody(prompt: string) {
    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'system',
          content:
            'You are an API request body generator. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],

      temperature: 0.2,
    });
    const content = completion.choices[0].message.content ?? '';

    const cleaned = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return {
      body: cleaned,
    };
  }
  async summarize(response: any) {
  const completion =
    await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'system',
          content: `
You are an API response summarizer.

Return exactly 5 plain text lines.

Rules:
- No markdown.
- No '*' or '-'.
- No numbering.
- No introduction.
- Ignore JWT tokens.
- Ignore refresh tokens.
- Keep every line under 8 words.
- Mention only important response fields.
- Keep complete email addresses.
- Never shorten usernames or emails.

Example output:

Login successful
Username: emilys
Email: emily.johnson@x.dummyjson.com
Authentication completed
User information returned
`,
        },
        {
          role: 'user',
          content: JSON.stringify(response),
        },
      ],

      temperature: 0.2,
    });

  return {
    summary: completion.choices[0].message.content?.trim(),
  };
}
async generateTests(response: any) {
  const completion =
    await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'system',
          content: `
You are an API test generator.

Generate JavaScript test code ONLY.

Rules:
- Return ONLY executable JavaScript.
- Do NOT add explanations.
- Do NOT add examples.
- Do NOT add markdown.
- Do NOT write "Here's an example".
- Do NOT write any text before or after the code.
- Output must start with: pm.test(
- Use only:
  - pm.test()
  - pm.expect()
  - pm.response.code
  - pm.response.json()
- Use only these matchers:
  - .to.eql(...)
  - .to.equal(...)
  - .to.be.true
- Never use:
  - pm.response.to.have.status()
  - .to.have
  - .to.be.a
  - .to.be.an
  - chai assertions
- Generate 3 to 6 useful tests based only on the provided response.
Never generate:

pm.expect(value).to.be.true

unless value is a boolean.

For property existence always use:

pm.expect(pm.response.json().property !== undefined).to.be.true;
`,
        },
        {
          role: 'user',
          content: `
Generate Postman compatible test scripts for this API response.

${JSON.stringify(response)}

Return JavaScript code only.
`
        },
      ],

      temperature: 0.2,
    });

  return {
    script:
      completion.choices[0].message.content
        ?.replace(/```javascript/g, '')
        .replace(/```/g, '')
        .trim(),
  };
}
async autocomplete(text: string) {
  const completion =
    await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'system',
          content: `
You are an API JSON autocomplete engine.

Rules:

Complete the user's JSON.

Return ONLY the remaining JSON.

No explanation.

No markdown.

No code block.

No extra text.
`,
        },
        {
          role: 'user',
          content: text,
        },
      ],

      temperature: 0.1,
    });

  return {
    suggestion:
      completion.choices[0].message.content,
  };
}
async modifyBody(
  body: any,
  instruction: string,
) {
  const completion =
    await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'system',
          content: `
You modify existing JSON.

Rules:
- Return ONLY valid JSON.
- Don't explain.
- Don't use markdown.
- Keep all existing fields unless user asks.
- Only modify requested fields.
`,
        },

        {
          role: 'user',
          content: `
Current JSON:

${JSON.stringify(body, null, 2)}

Instruction:

${instruction}
`,
        },
      ],

      temperature: 0.2,
    });

  return {
    body: completion.choices[0].message.content
      ?.replace(/```json/g, '')
      .replace(/```/g, '')
      .trim(),
  };
}
async explainError(error: any) {
  const completion =
    await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'system',
          content: `
Explain API errors.

Return:
- What happened
- Possible reason
- Fix

Maximum 5 short lines.
`,
        },

        {
          role: 'user',
          content: JSON.stringify(error),
        },
      ],

      temperature: 0.2,
    });

  return {
    explanation:
      completion.choices[0].message.content,
  };
}
}
