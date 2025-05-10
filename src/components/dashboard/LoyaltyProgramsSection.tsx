
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LoyaltyProgram {
  id: string;
  name: string;
  type: string;
  reward: string;
  rule: string;
}

const mockPrograms: LoyaltyProgram[] = [
  {
    id: "1",
    name: "Visit Points",
    type: "Points",
    reward: "Free Service",
    rule: "Earn 3 points per visit. Redeem 30 points for a free service."
  },
  {
    id: "2",
    name: "Haircut Bundle",
    type: "Bundle",
    reward: "Free Haircut",
    rule: "Buy 5 haircuts, get the 6th free."
  },
  {
    id: "3",
    name: "Spa Cashback",
    type: "Cashback",
    reward: "10% Back",
    rule: "Earn 10% of each spa service as store credit."
  },
];

const programTypes = ["Points", "Cashback", "Bundle"];

const LoyaltyProgramsSection = () => {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>(mockPrograms);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProgram, setEditingProgram] = useState<LoyaltyProgram | null>(null);
  
  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
      reward: "",
      rule: "",
    },
  });

  const handleOpenEditDialog = (program: LoyaltyProgram) => {
    setEditingProgram(program);
    form.reset({
      name: program.name,
      type: program.type,
      reward: program.reward,
      rule: program.rule,
    });
    setOpenDialog(true);
  };

  const handleOpenNewDialog = () => {
    setEditingProgram(null);
    form.reset({
      name: "",
      type: "",
      reward: "",
      rule: "",
    });
    setOpenDialog(true);
  };

  const handleSubmit = (data: any) => {
    if (editingProgram) {
      // Update existing program
      setPrograms(programs.map(p => 
        p.id === editingProgram.id ? { ...p, ...data } : p
      ));
    } else {
      // Create new program
      const newProgram = {
        id: (programs.length + 1).toString(),
        ...data
      };
      setPrograms([...programs, newProgram]);
    }
    
    setOpenDialog(false);
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter(program => program.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Loyalty Programs</h2>
        
        <Button className="bg-glow-gradient hover:opacity-90" onClick={handleOpenNewDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Loyalty Program
        </Button>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Active Programs ({programs.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Reward</TableHead>
                <TableHead className="hidden md:table-cell">Rule</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                      {program.type}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{program.reward}</TableCell>
                  <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                    {program.rule}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(program)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProgram(program.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit Loyalty Program" : "Create Loyalty Program"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Visit Points" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Free Service" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe how clients earn and redeem rewards"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Explain how points accumulate or when rewards are given.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-glow-gradient hover:opacity-90">
                {editingProgram ? "Update Program" : "Create Program"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoyaltyProgramsSection;
