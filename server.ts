import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const styleSchema = {
  type: Type.OBJECT,
  properties: {
    color: { type: Type.STRING },
    fontSize: { type: Type.STRING },
    fontWeight: { type: Type.STRING },
    fontFamily: { type: Type.STRING },
    align: { type: Type.STRING },
    bg: { type: Type.STRING },
    radius: { type: Type.STRING },
    paddingX: { type: Type.STRING },
    paddingY: { type: Type.STRING },
    width: { type: Type.STRING },
    height: { type: Type.STRING },
    gap: { type: Type.STRING },
    flexDirection: { type: Type.STRING },
    flexWrap: { type: Type.STRING },
    justifyContent: { type: Type.STRING },
    alignItems: { type: Type.STRING },
    gridTemplateColumns: { type: Type.STRING },
  }
};

function getElementSchema(depth: number = 3): any {
  const schema: any = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "Unique identifier for the element, e.g. elem_123" },
      kind: { type: Type.STRING, description: "Type of widget (e.g. heading, paragraph, button, image, container, grid, flex, card, lottie)" },
      text: { type: Type.STRING, description: "Inner text content or button label" },
      placeholder: { type: Type.STRING, description: "Input or form placeholder text" },
      href: { type: Type.STRING, description: "Link destination URL" },
      imageUrl: { type: Type.STRING, description: "Image source URL" },
      style: styleSchema,
    },
    required: ["kind", "text"],
  };

  if (depth > 0) {
    schema.properties.children = {
      type: Type.ARRAY,
      description: "Nested elements inside this layout element",
      items: getElementSchema(depth - 1)
    };
  }

  return schema;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate complete page structure and AI Thinking securely on the server
  app.post("/api/gemini/generate-page", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Prompt is required and must be a string." });
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are an expert AI web designer and layout engineer comparable to Framer AI.
Analyze the user's prompt to automatically detect the business type, target audience, brand color palette, layout system, and tone of voice.
You must output a beautifully structured landing page config matching the exact provided JSON Schema.

CRITICAL DESIGN REQUIREMENTS:
1. No HTML tags or raw code in fields.
2. Unlimited nesting is supported. Utilize containers, flex rows, grids, and cards.
3. Every container/flex/grid element can have a 'children' array containing nested elements.
4. Copywriting must be professional, compelling, and fully complete (NEVER use Lorem Ipsum or placeholder text). Write in high-quality Bengali unless requested otherwise.
5. Provide realistic Unsplash image URLs or keywords matching the theme (e.g., https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800 for kids speech therapy, or photo-1573497019940-1c28c88b4f3e?w=800 for expert doctors).

For elements, choose from theseKinds:
- "container", "flex", "grid", "card" (layout nodes)
- "eyebrow", "heading", "paragraph", "button", "image", "video", "stat", "icon-text" (basic widgets)
- "input", "checkbox", "radio", "select", "textarea", "calendar", "avatar", "badge", "tabs", "accordion", "carousel", "chart", "map", "progress", "toast" (advanced widgets)

Return a comprehensive thinking process metadata, a theme config, and 4 to 6 content sections.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a fully polished landing page for: "${prompt}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              thinking: {
                type: Type.OBJECT,
                properties: {
                  businessType: { type: Type.STRING, description: "Detected business category" },
                  targetAudience: { type: Type.STRING, description: "Identified customer demographics" },
                  toneOfVoice: { type: Type.STRING, description: "Stylistic language guidelines" },
                  brandStrategy: { type: Type.STRING, description: "Strategic layout and color blueprint" },
                  colorsSelectedExplanation: { type: Type.STRING, description: "Why these colors represent the business" },
                },
                required: ["businessType", "targetAudience", "toneOfVoice", "brandStrategy", "colorsSelectedExplanation"]
              },
              theme: {
                type: Type.OBJECT,
                properties: {
                  colors: {
                    type: Type.OBJECT,
                    properties: {
                      primary: { type: Type.STRING, description: "Hex primary color code" },
                      secondary: { type: Type.STRING, description: "Hex secondary color code" },
                      accent: { type: Type.STRING, description: "Hex bright CTA accent code" },
                      success: { type: Type.STRING },
                      neutral: { type: Type.STRING },
                      dark: { type: Type.STRING },
                      light: { type: Type.STRING },
                    },
                    required: ["primary", "secondary", "accent", "success", "neutral", "dark", "light"]
                  },
                  typography: {
                    type: Type.OBJECT,
                    properties: {
                      headingFamily: { type: Type.STRING },
                      paragraphFamily: { type: Type.STRING },
                    },
                    required: ["headingFamily", "paragraphFamily"]
                  },
                  radius: { type: Type.STRING },
                },
                required: ["colors", "typography", "radius"]
              },
              sections: {
                type: Type.ARRAY,
                description: "Array of generated page sections",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    templateId: { type: Type.STRING },
                    name: { type: Type.STRING },
                    icon: { type: Type.STRING },
                    visible: { type: Type.BOOLEAN },
                    style: {
                      type: Type.OBJECT,
                      properties: {
                        bg: { type: Type.STRING },
                        textColor: { type: Type.STRING },
                        paddingY: { type: Type.STRING },
                        borderTop: { type: Type.BOOLEAN },
                        shadow: { type: Type.BOOLEAN },
                      },
                      required: ["bg", "textColor", "paddingY", "borderTop", "shadow"],
                    },
                    elements: {
                      type: Type.ARRAY,
                      items: getElementSchema(3)
                    },
                  },
                  required: ["templateId", "name", "icon", "visible", "style", "elements"],
                },
              },
            },
            required: ["thinking", "theme", "sections"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate page structure" });
    }
  });

  // API Route: Per-section AI editing/regeneration (visual styling, copy rewrite, CTAs, layout)
  app.post("/api/gemini/edit-section", async (req, res) => {
    const { prompt, section } = req.body;
    if (!prompt || !section) {
      res.status(400).json({ error: "Prompt and section JSON are required." });
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are an expert AI designer. Your task is to rewrite, redesign, or augment the provided page section based on the user's instructions.
Apply visual changes (bg, colors, styling), copywriting changes, add widgets (like another button, badge, or card), or modify layout structures (change to grid, center content) precisely as commanded.
Maintain compatibility with the Builder Component Registry (element kinds: heading, paragraph, button, image, container, grid, flex, card, badge, tabs, accordion, etc.).
NEVER return HTML. Return ONLY valid JSON matching the section schema. Do not change the original 'instanceId' if it was supplied, or keep the existing structure but update elements recursively.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: `Modify this section according to: "${prompt}"` },
          { text: `CURRENT SECTION JSON:\n${JSON.stringify(section, null, 2)}` }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              templateId: { type: Type.STRING },
              name: { type: Type.STRING },
              icon: { type: Type.STRING },
              visible: { type: Type.BOOLEAN },
              style: {
                type: Type.OBJECT,
                properties: {
                  bg: { type: Type.STRING },
                  textColor: { type: Type.STRING },
                  paddingY: { type: Type.STRING },
                  borderTop: { type: Type.BOOLEAN },
                  shadow: { type: Type.BOOLEAN },
                },
                required: ["bg", "textColor", "paddingY"]
              },
              elements: {
                type: Type.ARRAY,
                items: getElementSchema(3)
              }
            },
            required: ["templateId", "name", "style", "elements"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from edit-section model.");
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Gemini Section Edit Error:", error);
      res.status(500).json({ error: error.message || "Failed to edit section structure" });
    }
  });

  // API Route: AI Assistant Optimization Copilot Suggestions
  app.post("/api/gemini/suggest-optimizations", async (req, res) => {
    const { element } = req.body;
    if (!element) {
      res.status(400).json({ error: "Active element is required for optimization suggestions." });
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are an active AI Conversion Rate Optimization (CRO) Co-pilot.
Analyze the selected website element or container provided in the payload.
Generate exactly 3 optimization suggestions.
Each suggestion must contain:
1. 'title': Short direct label (e.g. "Add Secondary Outline Button", "Stylize Headline", "Turn into Grid").
2. 'description': Conversion, accessibility, or visual reason for this change in professional Bengali.
3. 'patch': A valid JSON patch (Partial<BuilderElement>) that can be applied with Object.assign to improve this element's structure or style.
Ensure the suggestions are highly customized to the selected element kind (e.g. if heading, suggest size, font weights or colors; if flexbox, suggest alignment/gaps; if container, suggest adding a card layout or badge).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: `Suggest 3 optimizations for this component:` },
          { text: `COMPONENT JSON:\n${JSON.stringify(element, null, 2)}` }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    patch: {
                      type: Type.OBJECT,
                      description: "A dictionary of attributes to patch onto the current element (e.g., style updates or adding children)"
                    }
                  },
                  required: ["title", "description", "patch"]
                }
              }
            },
            required: ["suggestions"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from suggest-optimizations model.");
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Gemini Suggestions Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate suggestions" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
