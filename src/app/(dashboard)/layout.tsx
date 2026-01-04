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
    <div className="h-screen">

      <CreateWorkspaceModal/>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg "
      >
        <ResizablePanel defaultSize={20} className="hidden lg:block">
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle  className="hidden lg:block"/>
        <ResizablePanel defaultSize={80} className="flex flex-col">
          <Navbar />
          <div className="p-6 flex-1">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
