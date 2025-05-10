
import { Users, CalendarDays, List, FileText, ChartBar } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const DashboardSidebar = ({ currentTab, setCurrentTab }: DashboardSidebarProps) => {
  // Update to use the state property instead of collapsed which doesn't exist
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const menuItems = [
    { id: "clients", label: "Clients", icon: Users },
    { id: "visits", label: "Visits", icon: CalendarDays },
    { id: "loyalty", label: "Loyalty Programs", icon: List },
    { id: "rewards", label: "Rewards", icon: FileText },
    { id: "reports", label: "Reports", icon: ChartBar },
  ];

  return (
    <Sidebar className={collapsed ? "w-16 hidden md:block" : "w-64 hidden md:block"}>
      <SidebarContent className="pt-8">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                className={`w-full flex items-center ${
                  currentTab === item.id
                    ? "bg-glow-gradient text-white font-medium"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setCurrentTab(item.id)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
