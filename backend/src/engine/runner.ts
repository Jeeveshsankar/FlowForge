/**
 * FlowForge Workflow Execution Engine
 * Handles the logic traversal and real-time log streaming for automation runs.
 */

import { io, prisma } from "../index"

interface Node {
  id: string
  type: string
  data: any
}

interface Edge {
  source: string
  target: string
}

export class WorkflowRunner {
  private runId: string
  private workflowId: string
  private userId: string
  private nodes: Node[]
  private edges: Edge[]
  private context: Record<string, any> = {}
  private logs: any[] = []

  constructor(runId: string, workflowId: string, userId: string, nodes: any[], edges: any[], initialPayload: any) {
    this.runId = runId
    this.workflowId = workflowId
    this.userId = userId
    this.nodes = nodes
    this.edges = edges
    this.context = { trigger: { payload: initialPayload } }
  }

  // Very simplified topological sort for DAG
  private getExecutionOrder(): string[] {
    const inDegree: Record<string, number> = {}
    const graph: Record<string, string[]> = {}
    
    this.nodes.forEach(n => {
      inDegree[n.id] = 0
      graph[n.id] = []
    })

    this.edges.forEach(e => {
      if (graph[e.source]) graph[e.source].push(e.target)
      if (inDegree[e.target] !== undefined) inDegree[e.target]++
    })

    const queue: string[] = Object.keys(inDegree).filter(id => inDegree[id] === 0)
    const order: string[] = []

    while (queue.length > 0) {
      const current = queue.shift()!
      order.push(current)
      
      graph[current].forEach(neighbor => {
        inDegree[neighbor]--
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor)
        }
      })
    }

    return order
  }

  private async executeNode(node: Node) {
    const startTime = Date.now()
    let result: any = {}
    let status = "success"

    try {
      // Simulate node execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100))
      
      if (node.data.type === "ai") {
        result = { generated_text: "This is a simulated AI response based on inputs." }
      } else if (node.data.type === "integration") {
        result = { api_status: 200, message: "Successfully sent payload" }
      } else {
        result = { processed: true, timestamp: new Date().toISOString() }
      }

      this.context[node.id] = result
    } catch (error) {
      status = "failed"
      result = { error: "Execution failed" }
    }

    const duration = Date.now() - startTime
    
    const logEntry = {
      id: Date.now(),
      node: node.data.label || node.type,
      status,
      time: new Date().toISOString(),
      duration: `${duration}ms`,
      data: result
    }

    this.logs.push(logEntry)

    // Emit real-time event
    io.to(this.userId).emit("workflow-log", {
      runId: this.runId,
      workflowId: this.workflowId,
      log: logEntry
    })
  }

  public async run() {
    try {
      await prisma.workflowRun.update({
        where: { id: this.runId },
        data: { status: "running" }
      })

      io.to(this.userId).emit("workflow-update", {
        runId: this.runId,
        status: "running"
      })

      const order = this.getExecutionOrder()
      
      for (const nodeId of order) {
        const node = this.nodes.find(n => n.id === nodeId)
        if (node) {
          await this.executeNode(node)
        }
      }

      await prisma.workflowRun.update({
        where: { id: this.runId },
        data: {
          status: "success",
          completed_at: new Date(),
          steps: JSON.stringify(this.logs)
        }
      })

      // Emit dashboard update
      io.to(this.userId).emit("workflow-update", {
        runId: this.runId,
        status: "success"
      })

    } catch (error: any) {
      await prisma.workflowRun.update({
        where: { id: this.runId },
        data: {
          status: "failed",
          completed_at: new Date(),
          error_message: error.message,
          steps: JSON.stringify(this.logs)
        }
      })

      io.to(this.userId).emit("workflow-update", {
        runId: this.runId,
        status: "failed"
      })
    }
  }
}
