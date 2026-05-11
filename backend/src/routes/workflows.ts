/**
 * FlowForge Workflow API Routes
 * Handles CRUD operations and manual execution of automation workflows.
 */

import { Router } from "express"
import { prisma } from "../index"
import { requireAuth } from "../middleware/auth"

const router = Router()

// All workflow routes require a valid JWT session
router.use(requireAuth)

/**
 * @route   GET /workflows
 * @desc    Fetch all workflows belonging to the authenticated operative
 */
router.get("/", async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    const workflows = await prisma.workflow.findMany({
      where: { user_id: userId },
      include: {
        _count: {
          select: { runs: true }
        }
      },
      orderBy: { updated_at: "desc" }
    })
    
    res.json(workflows)
  } catch (error) {
    console.error("[Workflows] Fetch error:", error)
    res.status(500).json({ error: "Failed to synchronize workflows" })
  }
})

/**
 * @route   POST /workflows
 * @desc    Initialize a new automation blueprint
 */
router.post("/", async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { name, description } = req.body
    
    const workflow = await prisma.workflow.create({
      data: {
        user_id: userId,
        name: name || "Untitled Workflow",
        description: description || "",
        nodes: "[]",
        edges: "[]"
      }
    })
    res.status(201).json(workflow)
  } catch (error) {
    console.error("[Workflows] Creation error:", error)
    res.status(500).json({ error: "Failed to initialize blueprint" })
  }
})

// Get one workflow
router.get("/:id", async (req, res) => {
  try {
    const userId = (req as any).user.id
    const workflow = await prisma.workflow.findUnique({
      where: { id: req.params.id }
    })
    
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: "Workflow not found" })
    }
    res.json(workflow)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Update workflow
router.put("/:id", async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { name, description, nodes, edges, is_active } = req.body
    
    // Check ownership
    const existing = await prisma.workflow.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.user_id !== userId) {
      return res.status(404).json({ error: "Workflow not found" })
    }

    const workflow = await prisma.workflow.update({
      where: { id: req.params.id },
      data: {
        name: name !== undefined ? name : existing.name,
        description: description !== undefined ? description : existing.description,
        nodes: nodes !== undefined ? JSON.stringify(nodes) : existing.nodes,
        edges: edges !== undefined ? JSON.stringify(edges) : existing.edges,
        is_active: is_active !== undefined ? is_active : existing.is_active,
      }
    })
    res.json(workflow)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Delete workflow
router.delete("/:id", async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    const existing = await prisma.workflow.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.user_id !== userId) {
      return res.status(404).json({ error: "Workflow not found" })
    }

    await prisma.workflow.delete({ where: { id: req.params.id } })
    res.json({ message: "Workflow deleted" })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

import { WorkflowRunner } from "../engine/runner"

// Run workflow manually
router.post("/:id/run", async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    const workflow = await prisma.workflow.findUnique({ where: { id: req.params.id } })
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: "Workflow not found" })
    }

    const run = await prisma.workflowRun.create({
      data: {
        workflow_id: req.params.id,
        user_id: userId,
        status: "pending",
        trigger_data: JSON.stringify(req.body)
      }
    })
    
    // Invoke engine
    const nodes = typeof workflow.nodes === 'string' ? JSON.parse(workflow.nodes) : workflow.nodes
    const edges = typeof workflow.edges === 'string' ? JSON.parse(workflow.edges) : workflow.edges
    
    const runner = new WorkflowRunner(run.id, workflow.id, userId, nodes as any[], edges as any[], req.body)
    
    // Run async in background
    runner.run()
    
    res.status(202).json({ message: "Workflow run started", runId: run.id })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

export { router as workflowsRouter }
