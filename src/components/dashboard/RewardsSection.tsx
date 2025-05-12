
import { useState, useEffect } from "react";
import { Search, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Reward {
  id: string;
  client_id: string;
  program_id: string;
  created_at: string;
  clientName?: string;
  programName?: string;
  reward?: string;
  value?: number;
}

const RewardsSection = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchRewards();
    }
  }, [user]);
  
  const fetchRewards = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("client_rewards")
        .select(`
          *,
          clients (name),
          loyalty_programs (name, reward)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Transform data to include client names and rewards
      const transformedData: Reward[] = (data || []).map(item => ({
        id: item.id,
        client_id: item.client_id,
        program_id: item.program_id,
        created_at: item.created_at,
        clientName: item.clients?.name || "Cliente desconhecido",
        programName: item.loyalty_programs?.name || "Programa desconhecido",
        reward: item.loyalty_programs?.reward || "Recompensa não especificada",
        value: estimateValue(item.points, item.visits),
      }));
      
      setRewards(transformedData);
    } catch (error) {
      console.error("Erro ao buscar recompensas:", error);
      toast.error("Não foi possível carregar as recompensas");
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to estimate the value based on points/visits
  // This is just a placeholder - real system would have actual values
  const estimateValue = (points: number | null, visits: number | null): number => {
    if (points) return points * 0.5; // Assume each point is worth $0.50
    if (visits) return visits * 10; // Assume each visit is worth $10
    return 0;
  };
  
  const filteredRewards = rewards.filter((reward) => {
    const clientName = reward.clientName?.toLowerCase() || "";
    return clientName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Recompensas Resgatadas</h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Todas as Recompensas ({filteredRewards.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoaderIcon className="h-6 w-6 animate-spin text-primary mr-2" />
              <p>Carregando recompensas...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Recompensa</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead className="hidden md:table-cell">Data Resgatada</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRewards.length > 0 ? (
                  filteredRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">{reward.clientName}</TableCell>
                      <TableCell>{reward.reward}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{reward.programName}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(parseISO(reward.created_at), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {reward.value?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma recompensa encontrada</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSection;
