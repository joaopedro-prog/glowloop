
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Limpeza de Pele",
    description: "Tratamento facial completo para remoção de impurezas",
    price: 120,
    duration: 60,
    category: "Facial"
  },
  {
    id: "2",
    name: "Manicure",
    description: "Cuidados com as unhas das mãos",
    price: 45,
    duration: 45,
    category: "Unhas"
  },
  {
    id: "3",
    name: "Corte de Cabelo",
    description: "Corte e finalização",
    price: 70,
    duration: 60,
    category: "Cabelo"
  },
];

const categories = ["Facial", "Unhas", "Cabelo", "Corpo", "Massagem", "Maquiagem", "Outro"];

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "",
    },
  });

  const handleOpenEditDialog = (service: Service) => {
    setEditingService(service);
    form.reset({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
    });
    setOpenDialog(true);
  };

  const handleOpenNewDialog = () => {
    setEditingService(null);
    form.reset({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "",
    });
    setOpenDialog(true);
  };

  const handleSubmit = (data: any) => {
    if (editingService) {
      // Atualizar serviço existente
      setServices(services.map(s => 
        s.id === editingService.id ? { ...s, ...data } : s
      ));
      toast({
        title: "Serviço atualizado",
        description: `${data.name} foi atualizado com sucesso.`,
      });
    } else {
      // Criar novo serviço
      const newService = {
        id: (services.length + 1).toString(),
        ...data
      };
      setServices([...services, newService]);
      toast({
        title: "Serviço adicionado",
        description: `${data.name} foi adicionado com sucesso.`,
      });
    }
    
    setOpenDialog(false);
  };

  const handleDeleteService = (id: string) => {
    const serviceToDelete = services.find(service => service.id === id);
    setServices(services.filter(service => service.id !== id));
    
    toast({
      title: "Serviço removido",
      description: `${serviceToDelete?.name} foi removido com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Serviços Oferecidos</h2>
        
        <Button className="bg-glow-gradient hover:opacity-90" onClick={handleOpenNewDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo Serviço
        </Button>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Serviços Disponíveis ({services.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                <TableHead className="hidden md:table-cell">Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                    {service.description}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                  <TableCell>{service.duration} min</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar Serviço" : "Adicionar Novo Serviço"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Serviço</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Limpeza de Pele" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Uma breve descrição do serviço" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (minutos)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="5"
                          step="5"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        <option value="">Selecione uma categoria...</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Selecione uma categoria para organizar seus serviços
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-glow-gradient hover:opacity-90">
                {editingService ? "Salvar Alterações" : "Adicionar Serviço"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesSection;
