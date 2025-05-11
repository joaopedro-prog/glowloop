
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistance, subMonths, startOfMonth, parseISO, isAfter, format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ReportsSection = () => {
  const { user } = useAuth();
  const [visitData, setVisitData] = useState<any[]>([]);
  const [rewardData, setRewardData] = useState<any[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [rewardCount, setRewardCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar total de clientes
        const { count: clientsCount, error: clientsError } = await supabase
          .from("clients")
          .select("id", { count: 'exact', head: true })
          .eq("user_id", user.id);
          
        if (clientsError) throw clientsError;
        
        setClientCount(clientsCount || 0);
        
        // Buscar dados para gráficos por meses
        const last10Months = Array.from({ length: 10 }).map((_, i) => {
          const date = subMonths(new Date(), i);
          return {
            month: startOfMonth(date),
            name: format(date, "MMM", { locale: ptBR }),
            visits: 0,
            rewards: 0
          };
        }).reverse();
        
        // Buscar visitas
        const { data: visits, error: visitsError } = await supabase
          .from("client_visits")
          .select("*")
          .eq("user_id", user.id);
          
        if (visitsError) throw visitsError;
        
        // Dados mensais para gráfico de visitas
        const formattedVisitData = [...last10Months];
        
        let totalVisitsThisMonth = 0;
        
        if (visits) {
          visits.forEach(visit => {
            const visitDate = parseISO(visit.visit_date);
            const thisMonth = new Date().getMonth();
            const visitMonth = visitDate.getMonth();
            
            // Contar visitas deste mês
            if (visitMonth === thisMonth && visitDate.getFullYear() === new Date().getFullYear()) {
              totalVisitsThisMonth++;
            }
            
            // Dados para o gráfico
            const monthIndex = formattedVisitData.findIndex(item => 
              item.month.getMonth() === visitDate.getMonth() && 
              item.month.getFullYear() === visitDate.getFullYear()
            );
            
            if (monthIndex !== -1) {
              formattedVisitData[monthIndex].visits++;
            }
          });
        }
        
        setVisitData(formattedVisitData);
        setVisitCount(totalVisitsThisMonth);
        
        // Buscar recompensas resgatadas
        const { data: rewards, error: rewardsError } = await supabase
          .from("client_rewards")
          .select("*")
          .eq("user_id", user.id);
          
        if (rewardsError) throw rewardsError;
        
        // Dados mensais para gráfico de recompensas
        const formattedRewardData = [...last10Months];
        
        let totalRewards = 0;
        
        if (rewards) {
          rewards.forEach(reward => {
            totalRewards++;
            
            if (reward.created_at) {
              const rewardDate = parseISO(reward.created_at);
              
              const monthIndex = formattedRewardData.findIndex(item => 
                item.month.getMonth() === rewardDate.getMonth() && 
                item.month.getFullYear() === rewardDate.getFullYear()
              );
              
              if (monthIndex !== -1) {
                formattedRewardData[monthIndex].rewards++;
              }
            }
          });
        }
        
        setRewardData(formattedRewardData);
        setRewardCount(totalRewards);
        
      } catch (error) {
        console.error("Erro ao buscar dados para relatórios:", error);
        toast.error("Não foi possível carregar os relatórios");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-glow-pink">{clientCount}</div>
            <p className="text-xs text-muted-foreground">Total de clientes cadastrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Visitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-aqua-suave">{visitCount}</div>
            <p className="text-xs text-muted-foreground">Visitas este mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recompensas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mint">{rewardCount}</div>
            <p className="text-xs text-muted-foreground">Recompensas resgatadas</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visitas Mensais</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#FF89BB" 
                  strokeWidth={2} 
                  dot={{ stroke: '#FF89BB', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recompensas Resgatadas</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rewardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="rewards" 
                  fill="#7EE8FA" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsSection;
