import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CreateWorkspaceModal from "@/modules/workspaces/components/CreateWorkspaceModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen rounded-lg "
      >
        <ResizablePanel defaultSize={20} className="hidden lg:block">
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle className="hidden lg:block" />
        <ResizablePanel defaultSize={80} >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
