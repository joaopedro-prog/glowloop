
import { useState } from "react";
import { Plus, Search, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Visit {
  id: string;
  clientId: string;
  clientName: string;
  date: Date;
  service: string;
  value: number;
}

const mockVisits: Visit[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "Emma Johnson",
    date: new Date(2023, 9, 15),
    service: "Full Hair Treatment",
    value: 120.00
  },
  {
    id: "2",
    clientId: "1",
    clientName: "Emma Johnson",
    date: new Date(2023, 9, 2),
    service: "Manicure",
    value: 45.00
  },
  {
    id: "3",
    clientId: "2",
    clientName: "Sophia Martinez",
    date: new Date(2023, 9, 10),
    service: "Facial",
    value: 85.00
  },
];

const mockClients = [
  { id: "1", name: "Emma Johnson" },
  { id: "2", name: "Sophia Martinez" },
  { id: "3", name: "Daniel Wilson" },
];

const services = [
  "Haircut & Styling",
  "Color Treatment",
  "Hair Extensions",
  "Full Hair Treatment",
  "Facial",
  "Manicure",
  "Pedicure",
  "Full Spa Package"
];

const VisitsSection = () => {
  const [visits, setVisits] = useState<Visit[]>(mockVisits);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  
  const form = useForm({
    defaultValues: {
      clientId: "",
      date: new Date(),
      service: "",
      value: 0,
    },
  });

  const filteredVisits = visits.filter((visit) =>
    visit.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVisit = (data: any) => {
    const client = mockClients.find(c => c.id === data.clientId);
    
    if (!client) return;
    
    const newVisit = {
      id: (visits.length + 1).toString(),
      clientId: data.clientId,
      clientName: client.name,
      date: data.date,
      service: data.service,
      value: data.value
    };
    
    setVisits([...visits, newVisit]);
    setOpenDialog(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Visits / Consultations</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-glow-gradient hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Register New Visit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Visit</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddVisit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockClients.map(client => (
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
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map(service => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          This will automatically apply loyalty rules.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-glow-gradient hover:opacity-90">
                    Register Visit
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Recent Visits ({filteredVisits.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium">{visit.clientName}</TableCell>
                  <TableCell>{format(visit.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{visit.service}</TableCell>
                  <TableCell className="text-right">${visit.value.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {filteredVisits.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <CalendarDays className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No visits found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitsSection;
