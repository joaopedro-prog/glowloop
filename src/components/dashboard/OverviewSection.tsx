
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Gift, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, isToday, isThisWeek, parseISO, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Client = {
  id: string;
  name: string;
  birthday: string;
  email?: string;
  phone?: string;
};

const OverviewSection = () => {
  const { user } = useAuth();
  const [totalClients, setTotalClients] = useState(0);
  const [todayBirthdays, setTodayBirthdays] = useState<Client[]>([]);
  const [weekBirthdays, setWeekBirthdays] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Buscar todos os clientes
        const { data: clients, error } = await supabase
          .from("clients")
          .select("*")
          .eq("user_id", user.id);
          
        if (error) throw error;
        
        // Total de clientes
        setTotalClients(clients?.length || 0);
        
        // Filtrar aniversariantes
        const clientsWithBirthday = clients?.filter(client => client.birthday) || [];
        
        // Aniversariantes de hoje
        const today = clientsWithBirthday.filter(client => {
          if (!client.birthday) return false;
          const birthdayDate = parseISO(client.birthday);
          return isToday(birthdayDate);
        });
        setTodayBirthdays(today);
        
        // Aniversariantes da semana (próximos 7 dias)
        const thisWeek = clientsWithBirthday.filter(client => {
          if (!client.birthday) return false;
          const birthdayDate = parseISO(client.birthday);
          return isThisWeek(birthdayDate) && !isToday(birthdayDate);
        });
        setWeekBirthdays(thisWeek);
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Não foi possível carregar os dados dos clientes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const formatBirthday = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd 'de' MMMM", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/dashboard?tab=clients">
                Ver todos
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aniversariantes Hoje
              {todayBirthdays.length > 0 && (
                <Badge className="ml-2 bg-green-500">{todayBirthdays.length}</Badge>
              )}
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm">Carregando...</p>
            ) : todayBirthdays.length > 0 ? (
              <ul className="space-y-2">
                {todayBirthdays.map((client) => (
                  <li key={client.id} className="text-sm border-b pb-1">
                    <a href="/dashboard?tab=clients">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {client.phone || client.email || "Sem contato"}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum aniversariante hoje
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aniversariantes da Semana
              {weekBirthdays.length > 0 && (
                <Badge className="ml-2 bg-blue-500">{weekBirthdays.length}</Badge>
              )}
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm">Carregando...</p>
            ) : weekBirthdays.length > 0 ? (
              <ul className="space-y-2">
                {weekBirthdays.slice(0, 5).map((client) => (
                  <li key={client.id} className="text-sm border-b pb-1">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs">
                      {formatBirthday(client.birthday)}
                    </div>
                  </li>
                ))}
                {weekBirthdays.length > 5 && (
                  <li className="text-xs text-muted-foreground">
                    + {weekBirthdays.length - 5} outros
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum aniversariante esta semana
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Outras estatísticas e informações podem ser adicionadas aqui */}
      
    </div>
  );
};

export default OverviewSection;
