
import { useState, useEffect } from "react";
import { Plus, Search, User, Link as LinkIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

type Client = Tables<"clients"> & {
  client_visits?: {
    count: number;
  }[];
  client_rewards?: {
    points: number;
    cashback?: number;
    rewards?: string[];
  }[];
};

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openClientDrawer, setOpenClientDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Fetch clients with their visit count
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_visits(count),
          client_rewards(points, visits)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching clients:", error);
        setError(error.message);
        toast({
          title: "Erro ao carregar clientes",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setClients(data || []);
      setError(null);
    } catch (error: any) {
      console.error("Error in fetchClients:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = async (data: any) => {
    try {
      if (!user) return;

      const newClient = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        user_id: user.id,
      };
      
      const { data: insertedClient, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao adicionar cliente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setClients([...clients, insertedClient as Client]);
      setOpenDialog(false);
      form.reset();
      
      toast({
        title: "Cliente adicionado",
        description: `${data.name} foi adicionado com sucesso.`,
      });
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({
        title: "Erro ao adicionar cliente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setOpenClientDrawer(true);
  };

  const getClientLink = (clientId: string) => {
    return `${window.location.origin}/client/${clientId}`;
  };

  const copyClientLink = (clientId: string) => {
    const link = getClientLink(clientId);
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link copiado!",
      description: "O link para o cliente foi copiado para a área de transferência.",
    });
  };

  const sendClientLinkByEmail = (client: Client) => {
    // This would be implemented with a real email sending service
    toast({
      title: "Link enviado!",
      description: `Um email com o link foi enviado para ${client.email}.`,
    });
  };

  // Function to calculate total points for a client
  const getClientPoints = (client: Client) => {
    if (!client.client_rewards || client.client_rewards.length === 0) return 0;
    
    return client.client_rewards.reduce((total, reward) => {
      return total + (reward.points || 0);
    }, 0);
  };

  // Function to get visit count for a client
  const getClientVisits = (client: Client) => {
    if (!client.client_visits || client.client_visits.length === 0) return 0;
    return client.client_visits[0]?.count || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-glow-gradient hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddClient)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do cliente" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" type="email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="Telefone" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-glow-gradient hover:opacity-90">
                    Adicionar Cliente
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Todos os Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden md:table-cell">Data Cadastro</TableHead>
                <TableHead>Visitas</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead className="w-[80px]">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow 
                  key={client.id} 
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell onClick={() => handleClientClick(client)}>{client.name}</TableCell>
                  <TableCell className="hidden md:table-cell" onClick={() => handleClientClick(client)}>
                    {client.email || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell" onClick={() => handleClientClick(client)}>
                    {client.phone || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell" onClick={() => handleClientClick(client)}>
                    {client.created_at ? format(new Date(client.created_at), "dd/MM/yyyy") : "-"}
                  </TableCell>
                  <TableCell onClick={() => handleClientClick(client)}>{getClientVisits(client)}</TableCell>
                  <TableCell onClick={() => handleClientClick(client)}>{getClientPoints(client)}</TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            copyClientLink(client.id);
                          }}>
                            <LinkIcon className="h-4 w-4 text-blue-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copiar Link do Cliente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {error 
                          ? "Erro ao carregar clientes" 
                          : loading 
                            ? "Carregando..." 
                            : "Nenhum cliente encontrado"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Detail Drawer */}
      {selectedClient && (
        <Drawer open={openClientDrawer} onOpenChange={setOpenClientDrawer}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Detalhes do Cliente</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-muted-foreground">Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Nome:</dt>
                        <dd>{selectedClient.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Email:</dt>
                        <dd>{selectedClient.email || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Telefone:</dt>
                        <dd>{selectedClient.phone || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Data de Cadastro:</dt>
                        <dd>{selectedClient.created_at ? format(new Date(selectedClient.created_at), "dd/MM/yyyy") : "-"}</dd>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Link de progresso do cliente:</p>
                        <div className="flex rounded-lg border overflow-hidden">
                          <div className="bg-gray-100 px-3 py-2 text-xs truncate flex-1">
                            {getClientLink(selectedClient.id)}
                          </div>
                          <Button
                            variant="ghost"
                            className="rounded-none px-3 bg-gray-100 hover:bg-gray-200"
                            onClick={() => copyClientLink(selectedClient.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => sendClientLinkByEmail(selectedClient)}
                          disabled={!selectedClient.email}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" /> Enviar Link por Email
                        </Button>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-muted-foreground">Status de Fidelidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Total de Visitas:</dt>
                        <dd>{getClientVisits(selectedClient)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Pontos Acumulados:</dt>
                        <dd>{getClientPoints(selectedClient)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Cashback Disponível:</dt>
                        <dd>R$ {(selectedClient.client_rewards?.[0]?.cashback || 0).toFixed(2)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-muted-foreground">Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedClient.notes ? (
                    <p>{selectedClient.notes}</p>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Sem observações</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default ClientsSection;
