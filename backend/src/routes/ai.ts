import { Router } from "express"
import OpenAI from "openai"
import { requireAuth } from "../middleware/auth"

const router = Router()

// Initialize OpenAI conditionally to prevent crashing if the key is missing during setup
let openai: OpenAI | null = null

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your_openai_key_here") {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

router.use(requireAuth)

router.post("/generate-workflow", async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" })
    }

    if (!openai) {
      // Fallback response if OpenAI key is not provided yet
      return res.json({
        nodes: [
          { id: "1", type: "flowNode", position: { x: 250, y: 100 }, data: { type: "trigger", icon: "action", label: "Schedule", description: "Run daily at 9am" } },
          { id: "2", type: "flowNode", position: { x: 250, y: 300 }, data: { type: "integration", icon: "github", label: "Fetch GitHub Issues", description: "Get recent issues" } },
          { id: "3", type: "flowNode", position: { x: 250, y: 500 }, data: { type: "integration", icon: "slack", label: "Post to Slack", description: "Send summary to #general" } }
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2", animated: true },
          { id: "e2-3", source: "2", target: "3", animated: true }
        ]
      })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI that generates workflow graph definitions based on natural language. 
          Return ONLY a valid JSON object with the following structure:
          {
            "nodes": [ { "id": "uuid", "type": "flowNode", "position": { "x": number, "y": number }, "data": { "type": "trigger|action|integration|ai", "icon": "webhook|action|github|slack|ai|database", "label": "string", "description": "string" } } ],
            "edges": [ { "id": "uuid", "source": "nodeId", "target": "nodeId", "animated": true } ]
          }`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })

    const generated = JSON.parse(response.choices[0].message.content || '{"nodes":[],"edges":[]}')
    res.json(generated)

  } catch (error) {
    console.error("OpenAI Error:", error)
    res.status(500).json({ error: "Failed to generate workflow" })
  }
})

export { router as aiRouter }
