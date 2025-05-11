
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

const categories = ["Facial", "Unhas", "Cabelo", "Corpo", "Massagem", "Maquiagem", "Outro"];

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const { user } = useAuth();
  
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "",
    },
  });

  // Buscar serviços do Supabase
  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;
      
      try {
        setFetchingData(true);
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("user_id", user.id)
          .order("name");
          
        if (error) throw error;
        
        setServices(data || []);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        toast.error("Não foi possível carregar seus serviços");
      } finally {
        setFetchingData(false);
      }
    };
    
    fetchServices();
  }, [user]);

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

  const handleSubmit = async (data: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (editingService) {
        // Atualizar serviço existente
        const { error } = await supabase
          .from("services")
          .update({
            name: data.name,
            description: data.description,
            price: data.price,
            duration: data.duration,
            category: data.category,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingService.id);
          
        if (error) throw error;
        
        setServices(services.map(s => 
          s.id === editingService.id ? { ...s, ...data } : s
        ));
        
        toast.success("Serviço atualizado", {
          description: `${data.name} foi atualizado com sucesso.`,
        });
      } else {
        // Criar novo serviço
        const { data: newService, error } = await supabase
          .from("services")
          .insert([
            {
              user_id: user.id,
              name: data.name,
              description: data.description,
              price: data.price,
              duration: data.duration,
              category: data.category
            }
          ])
          .select()
          .single();
          
        if (error) throw error;
        
        setServices([...services, newService]);
        
        toast.success("Serviço adicionado", {
          description: `${data.name} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      toast.error("Não foi possível salvar o serviço");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete || !user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceToDelete);
        
      if (error) throw error;
      
      const serviceToDeleteObj = services.find(service => service.id === serviceToDelete);
      setServices(services.filter(service => service.id !== serviceToDelete));
      
      toast.success("Serviço removido", {
        description: `${serviceToDeleteObj?.name} foi removido com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      toast.error("Não foi possível excluir o serviço");
    } finally {
      setLoading(false);
      setDeleteDialog(false);
      setServiceToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialog(true);
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
              {fetchingData ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p>Carregando serviços...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
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
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(service.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo para adicionar/editar serviço */}
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
              
              <Button 
                type="submit" 
                className="w-full bg-glow-gradient hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  editingService ? "Salvar Alterações" : "Adicionar Serviço"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para exclusão */}
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Excluir Serviço"
        description="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        destructive={true}
        loading={loading}
      />
    </div>
  );
};

export default ServicesSection;
