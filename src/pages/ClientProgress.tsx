
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Award, Star, Check, LoaderIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Reward {
  id: string;
  name: string;
  claimed: boolean;
  expiresAt: Date | null;
  value: number;
}

interface ClientReward {
  id: string;
  points: number | null;
  visits: number | null;
  program: {
    name: string;
    reward: string;
  } | null;
}

interface ClientData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  pointsEarned: number;
  pointsNeeded: number;
  visitsCount: number;
  visitsTillNextReward: number;
  rewards: Reward[];
  lastVisit: Date | null;
  avatar?: string;
}

const ClientProgress = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) {
      fetchClientData(clientId);
    }
  }, [clientId]);

  const fetchClientData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar informações básicas do cliente
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();
        
      if (clientError) throw clientError;
      
      if (!clientData) {
        setError("Cliente não encontrado");
        return;
      }

      // Buscar visitas do cliente
      const { data: visitsData, error: visitsError } = await supabase
        .from("client_visits")
        .select("*")
        .eq("client_id", id)
        .order("visit_date", { ascending: false });
        
      if (visitsError) throw visitsError;
      
      // Obter a última data de visita
      const lastVisit = visitsData && visitsData.length > 0 
        ? parseISO(visitsData[0].visit_date)
        : null;

      // Buscar recompensas do cliente
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("client_rewards")
        .select(`
          id,
          points,
          visits,
          loyalty_programs (
            name,
            reward
          )
        `)
        .eq("client_id", id);
        
      if (rewardsError) throw rewardsError;
      
      // Calcular totais de pontos e visitas
      let totalPoints = 0;
      let totalVisits = visitsData?.length || 0;
      
      rewardsData?.forEach((reward: any) => {
        if (reward.points) totalPoints += reward.points;
      });
      
      // Transformar dados de recompensas
      const availableRewards: Reward[] = [];
      const claimedRewards: Reward[] = [];
      
      // Transformar recompensas do banco de dados para o formato esperado
      rewardsData?.forEach((reward: ClientReward) => {
        if (reward.loyalty_programs) {
          const rewardObj: Reward = {
            id: reward.id,
            name: reward.loyalty_programs.reward,
            claimed: false, // Assumimos que não há informação sobre reivindicação ainda
            expiresAt: null, // Não temos data de expiração no banco por enquanto
            value: (reward.points || 0) * 0.5, // Estimativa aproximada de valor
          };
          
          availableRewards.push(rewardObj);
        }
      });
      
      const clientInfo: ClientData = {
        id: clientData.id,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        birthday: clientData.birthday,
        pointsEarned: totalPoints,
        pointsNeeded: 50, // Valor padrão, pode ser configurado
        visitsCount: totalVisits,
        visitsTillNextReward: Math.max(0, 10 - (totalVisits % 10)), // A cada 10 visitas
        rewards: [...availableRewards, ...claimedRewards],
        lastVisit,
      };
      
      setClient(clientInfo);
      
    } catch (error: any) {
      console.error("Erro ao buscar dados do cliente:", error);
      setError("Não foi possível carregar os dados do cliente");
      toast.error("Erro ao carregar dados do cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = (rewardId: string) => {
    if (!client) return;
    
    // Atualizar estado local
    setClient({
      ...client,
      rewards: client.rewards.map(reward => 
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      )
    });

    toast({
      title: "Recompensa solicitada!",
      description: "Um email foi enviado para confirmar seu agendamento.",
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-50">
        <div className="text-center">
          <LoaderIcon className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-lg text-purple-700">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-50">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="text-center bg-red-50">
            <CardTitle className="text-red-700">Cliente não encontrado</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-center text-gray-700 mb-4">
              {error || "O link que você acessou não está associado a nenhum cliente."}
            </p>
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                Voltar para a página inicial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableRewards = client.rewards.filter(reward => !reward.claimed);
  const claimedRewards = client.rewards.filter(reward => reward.claimed);
  const pointsProgress = Math.min(100, Math.round((client.pointsEarned / client.pointsNeeded) * 100));
  const visitsProgress = Math.min(100, Math.round(((10 - client.visitsTillNextReward) / 10) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            GlowLoop Pro
          </h1>
          <p className="text-gray-600">Programa de Fidelidade</p>
        </div>

        {/* Client Info Card */}
        <Card className="mb-8 shadow-lg border-t-4 border-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <CardTitle>{client.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {client.birthday && `Aniversário: ${format(parseISO(client.birthday), "dd/MM")}`}
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                {client.visitsCount} visitas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Points Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Seus Pontos
                  </h3>
                  <span className="text-sm font-medium">{client.pointsEarned}/{client.pointsNeeded}</span>
                </div>
                <Progress value={pointsProgress} className="h-3" />
                <p className="text-xs text-gray-500 mt-2">
                  {client.pointsNeeded - client.pointsEarned} pontos para a próxima recompensa
                </p>
              </div>

              {/* Visits Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center">
                    <Award className="h-4 w-4 mr-2 text-blue-500" />
                    Programa de Visitas
                  </h3>
                  <span className="text-sm font-medium">{10 - client.visitsTillNextReward}/10</span>
                </div>
                <Progress value={visitsProgress} className="h-3" />
                <p className="text-xs text-gray-500 mt-2">
                  {client.visitsTillNextReward} visitas para seu próximo bônus
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Última visita: {client.lastVisit ? format(client.lastVisit, "dd/MM/yyyy") : "Nenhuma visita registrada"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle className="flex items-center text-xl">
              <Gift className="h-5 w-5 mr-2 text-green-600" />
              Recompensas Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {availableRewards.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Você não tem recompensas disponíveis no momento.
              </p>
            ) : (
              <div className="space-y-4">
                {availableRewards.map(reward => (
                  <div key={reward.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                    <div className="mb-3 md:mb-0">
                      <h3 className="font-medium">{reward.name}</h3>
                      {reward.expiresAt && (
                        <p className="text-xs text-red-500">
                          Expira em {format(reward.expiresAt, "dd/MM/yyyy")}
                        </p>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleClaimReward(reward.id)}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90"
                    >
                      Solicitar Recompensa
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Claimed Rewards */}
        {claimedRewards.length > 0 && (
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
              <CardTitle className="flex items-center text-xl">
                <Check className="h-5 w-5 mr-2 text-gray-600" />
                Recompensas Utilizadas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                {claimedRewards.map(reward => (
                  <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <h3 className="text-sm text-gray-600">{reward.name}</h3>
                    <Badge variant="outline" className="text-gray-500">Utilizada</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientProgress;
