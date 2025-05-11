
import { Users, CalendarDays, List, FileText, ChartBar, Home, LayoutGrid } from "lucide-react";
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
    { id: "overview", label: "Visão Geral", icon: Home },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "visits", label: "Visitas", icon: CalendarDays },
    { id: "services", label: "Serviços", icon: LayoutGrid },
    { id: "loyalty", label: "Fidelidade", icon: List },
    { id: "rewards", label: "Recompensas", icon: FileText },
    { id: "reports", label: "Relatórios", icon: ChartBar },
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
