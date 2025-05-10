
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsSection from "@/components/dashboard/ClientsSection";
import VisitsSection from "@/components/dashboard/VisitsSection";
import LoyaltyProgramsSection from "@/components/dashboard/LoyaltyProgramsSection";
import RewardsSection from "@/components/dashboard/RewardsSection";
import ReportsSection from "@/components/dashboard/ReportsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState("clients");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-off-white">
        <DashboardSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="block md:hidden mb-6">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="w-full grid grid-cols-5">
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                  <TabsTrigger value="visits">Visits</TabsTrigger>
                  <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {currentTab === "clients" && <ClientsSection />}
            {currentTab === "visits" && <VisitsSection />}
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
