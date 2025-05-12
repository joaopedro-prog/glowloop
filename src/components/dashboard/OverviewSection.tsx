
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Gift, ChevronRight, LoaderIcon } from "lucide-react";
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
  email?: string | null;
  phone?: string | null;
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
        
        // Função para verificar se a data corresponde ao dia de hoje
        const isTodayBirthday = (birthday: string) => {
          const birthdayDate = parseISO(birthday);
          const today = new Date();
          return birthdayDate.getDate() === today.getDate() && 
                 birthdayDate.getMonth() === today.getMonth();
        };

        // Função para verificar se o aniversário está na próxima semana (próximos 7 dias)
        const isNextWeekBirthday = (birthday: string) => {
          const birthdayDate = parseISO(birthday);
          const today = new Date();
          const nextWeek = addDays(today, 7);

          // Verificamos se o dia e mês correspondem a alguma data dos próximos 7 dias
          for (let i = 1; i <= 7; i++) {
            const checkDate = addDays(today, i);
            if (birthdayDate.getDate() === checkDate.getDate() && 
                birthdayDate.getMonth() === checkDate.getMonth()) {
              return true;
            }
          }
          
          return false;
        };
        
        // Aniversariantes de hoje
        const today = clientsWithBirthday.filter(client => {
          if (!client.birthday) return false;
          return isTodayBirthday(client.birthday);
        });
        
        setTodayBirthdays(today);
        
        // Aniversariantes da semana (próximos 7 dias)
        const thisWeek = clientsWithBirthday.filter(client => {
          if (!client.birthday) return false;
          return isNextWeekBirthday(client.birthday) && !isTodayBirthday(client.birthday);
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
      
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
            <p>Carregando dados...</p>
          </div>
        </div>
      ) : (
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
              {todayBirthdays.length > 0 ? (
                <ul className="space-y-2">
                  {todayBirthdays.map((client) => (
                    <li key={client.id} className="text-sm border-b pb-1">
                      <Link to={`/dashboard?tab=clients`}>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {client.phone || client.email || "Sem contato"}
                        </div>
                      </Link>
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
              {weekBirthdays.length > 0 ? (
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
      )}
    </div>
  );
};

export default OverviewSection;
