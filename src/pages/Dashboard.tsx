
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import ClientsSection from "@/components/dashboard/ClientsSection";
import VisitsSection from "@/components/dashboard/VisitsSection";
import LoyaltyProgramsSection from "@/components/dashboard/LoyaltyProgramsSection";
import RewardsSection from "@/components/dashboard/RewardsSection";
import ReportsSection from "@/components/dashboard/ReportsSection";
import ServicesSection from "@/components/dashboard/ServicesSection";
import OverviewSection from "@/components/dashboard/OverviewSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");
  const [currentTab, setCurrentTab] = useState(tabParam || "overview");
  const { user } = useAuth();

  useEffect(() => {
    if (tabParam) {
      setCurrentTab(tabParam);
    }
  }, [tabParam]);

  // Atualizar a URL quando a aba mudar
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };

  // Redirecionar para login se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-off-white">
        <DashboardSidebar currentTab={currentTab} setCurrentTab={handleTabChange} />
        
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="block md:hidden mb-6">
              <Tabs value={currentTab} onValueChange={handleTabChange}>
                <TabsList className="w-full grid grid-cols-7">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="clients">Clientes</TabsTrigger>
                  <TabsTrigger value="visits">Visitas</TabsTrigger>
                  <TabsTrigger value="services">Serviços</TabsTrigger>
                  <TabsTrigger value="loyalty">Fidelidade</TabsTrigger>
                  <TabsTrigger value="rewards">Recompensas</TabsTrigger>
                  <TabsTrigger value="reports">Relatórios</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {currentTab === "overview" && <OverviewSection />}
            {currentTab === "clients" && <ClientsSection />}
            {currentTab === "visits" && <VisitsSection />}
            {currentTab === "services" && <ServicesSection />}
            {currentTab === "loyalty" && <LoyaltyProgramsSection />}
            {currentTab === "rewards" && <RewardsSection />}
            {currentTab === "reports" && <ReportsSection />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
