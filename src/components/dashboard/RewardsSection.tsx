
import { useState, useEffect } from "react";
import { Search, LoaderIcon, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Client {
  id: string;
  name: string;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  reward: string;
}

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
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  
  const form = useForm({
    defaultValues: {
      client_id: "",
      program_id: "",
      points: 0,
      visits: 0,
    },
  });
  
  useEffect(() => {
    if (user) {
      fetchRewards();
      fetchClients();
      fetchPrograms();
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

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .eq("user_id", user?.id)
        .order("name");
        
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Não foi possível carregar os clientes");
    }
  };

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("loyalty_programs")
        .select("id, name, reward")
        .eq("user_id", user?.id);
        
      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Erro ao buscar programas:", error);
      toast.error("Não foi possível carregar os programas");
    }
  };
  
  // Helper function to estimate the value based on points/visits
  const estimateValue = (points: number | null, visits: number | null): number => {
    if (points) return points * 0.5; // Assume each point is worth R$0.50
    if (visits) return visits * 10; // Assume each visit is worth R$10
    return 0;
  };
  
  const handleAddReward = async (data: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("client_rewards")
        .insert({
          client_id: data.client_id,
          program_id: data.program_id,
          points: data.points || null,
          visits: data.visits || null,
          user_id: user.id,
        });
        
      if (error) throw error;
      
      toast.success("Recompensa adicionada com sucesso!");
      setOpenDialog(false);
      form.reset();
      
      // Atualizar a lista de recompensas
      fetchRewards();
    } catch (error: any) {
      console.error("Erro ao adicionar recompensa:", error);
      toast.error(`Erro ao adicionar recompensa: ${error.message}`);
    }
  };
  
  const filteredRewards = rewards.filter((reward) => {
    const clientName = reward.clientName?.toLowerCase() || "";
    return clientName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Recompensas Resgatadas</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-glow-gradient hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Recompensa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Recompensa</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddReward)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="client_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="program_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programa de Fidelidade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar programa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.id} value={program.id}>
                                {program.name} - {program.reward}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {programs.length === 0 && (
                          <div className="flex items-center mt-2 text-yellow-500 text-sm">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Nenhum programa encontrado. Adicione um programa de fidelidade primeiro.
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pontos</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Deixe em 0 se não for baseado em pontos
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="visits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visitas</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Deixe em 0 se não for baseado em visitas
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-glow-gradient hover:opacity-90">
                    Adicionar Recompensa
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
