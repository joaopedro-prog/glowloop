
import { useState } from "react";
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

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  firstVisit: Date;
  visits: number;
  points: number;
  cashback: number;
  rewards: string[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma@example.com",
    phone: "(555) 123-4567",
    firstVisit: new Date(2023, 5, 15),
    visits: 8,
    points: 24,
    cashback: 45.5,
    rewards: ["Free Facial", "30% Off"]
  },
  {
    id: "2",
    name: "Sophia Martinez",
    email: "sophia@example.com",
    phone: "(555) 987-6543",
    firstVisit: new Date(2023, 7, 3),
    visits: 5,
    points: 15,
    cashback: 27.8,
    rewards: ["Free Manicure"]
  },
  {
    id: "3",
    name: "Daniel Wilson",
    email: "daniel@example.com",
    phone: "(555) 234-5678",
    firstVisit: new Date(2023, 8, 21),
    visits: 3,
    points: 9,
    cashback: 18.5,
    rewards: []
  },
];

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openClientDrawer, setOpenClientDrawer] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      firstVisit: new Date(),
    },
  });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (data: any) => {
    const newClient = {
      id: (clients.length + 1).toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      firstVisit: data.firstVisit,
      visits: 0,
      points: 0,
      cashback: 0,
      rewards: []
    };
    
    setClients([...clients, newClient]);
    setOpenDialog(false);
    form.reset();
    
    toast({
      title: "Cliente adicionado",
      description: `${data.name} foi adicionado com sucesso.`,
    });
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
    setLinkCopied(true);
    
    toast({
      title: "Link copiado!",
      description: "O link para o cliente foi copiado para a área de transferência.",
    });
    
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const sendClientLinkByEmail = (client: Client) => {
    // Esta função seria implementada com uma chamada de API quando o Supabase estiver conectado
    // Por enquanto, apenas mostramos uma mensagem de sucesso
    toast({
      title: "Link enviado!",
      description: `Um email com o link foi enviado para ${client.email}.`,
    });
  };

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
                <TableHead className="hidden md:table-cell">Primeira Visita</TableHead>
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
                  <TableCell className="hidden md:table-cell" onClick={() => handleClientClick(client)}>{client.email}</TableCell>
                  <TableCell className="hidden md:table-cell" onClick={() => handleClientClick(client)}>{client.phone}</TableCell>
                  <TableCell className="hidden md:table-cell" onClick={() => handleClientClick(client)}>
                    {format(client.firstVisit, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell onClick={() => handleClientClick(client)}>{client.visits}</TableCell>
                  <TableCell onClick={() => handleClientClick(client)}>{client.points}</TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => copyClientLink(client.id)}>
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
                      <p className="text-muted-foreground">Nenhum cliente encontrado</p>
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
                        <dd>{selectedClient.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Telefone:</dt>
                        <dd>{selectedClient.phone}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Primeira Visita:</dt>
                        <dd>{format(selectedClient.firstVisit, "dd/MM/yyyy")}</dd>
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
                        <dd>{selectedClient.visits}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Pontos Acumulados:</dt>
                        <dd>{selectedClient.points}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Cashback Disponível:</dt>
                        <dd>R$ {selectedClient.cashback.toFixed(2)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-muted-foreground">Recompensas</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedClient.rewards.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedClient.rewards.map((reward, index) => (
                        <li key={index} className="flex items-center justify-between border-b pb-2">
                          <span>{reward}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(2023, 8, 15 + index * 5), "dd/MM/yyyy")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Nenhuma recompensa ainda</p>
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
