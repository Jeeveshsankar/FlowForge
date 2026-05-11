import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas"

export default function WorkflowBuilderPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#070711]">
      <WorkflowCanvas workflowId={params.id} />
    </div>
  )
}
