
import { useState } from "react";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardHeader = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden">
          <Menu size={20} />
        </SidebarTrigger>
        <a href="/">
          <h1 className="text-xl font-semibold text-glow-pink">GlowLoop</h1>
        </a>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-coral" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-aqua-suave text-indigo-dark">JP</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
