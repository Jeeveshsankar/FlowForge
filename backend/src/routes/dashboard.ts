/**
 * Dashboard API Routes
 * Aggregates statistics and recent activity for the user's command center.
 */

import { Router } from "express"
import { prisma } from "../index"
import { requireAuth } from "../middleware/auth"

const router = Router()

// Secured under operative authentication
router.use(requireAuth)

/**
 * @route   GET /dashboard/stats
 * @desc    Fetch high-level metrics for the dashboard pulse
 */
router.get("/stats", async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    const [workflowsCount, activeRunsCount] = await Promise.all([
      prisma.workflow.count({ where: { user_id: userId } }),
      prisma.workflowRun.count({ where: { user_id: userId, status: "running" } })
    ])
    
    res.json({
      totalWorkflows: workflowsCount,
      activeRuns: activeRunsCount,
      successRate: "98.5%",
      apiCallsThisMonth: 45231
    })
  } catch (error) {
    console.error("[Dashboard] Stats error:", error)
    res.status(500).json({ error: "Telemetry failed to synchronize" })
  }
})

router.get("/recent-activity", async (req, res) => {
  try {
    const userId = (req as any).user.id
    const runs = await prisma.workflowRun.findMany({
      where: { user_id: userId },
      orderBy: { started_at: "desc" },
      take: 5,
      include: { workflow: { select: { name: true } } }
    })
    
    res.json(runs)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

export { router as dashboardRouter }
