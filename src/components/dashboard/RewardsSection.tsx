
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Reward {
  id: string;
  clientName: string;
  rewardName: string;
  program: string;
  redeemed: Date;
  value: number;
}

const mockRewards: Reward[] = [
  {
    id: "1",
    clientName: "Emma Johnson",
    rewardName: "Free Facial",
    program: "Visit Points",
    redeemed: new Date(2023, 9, 5),
    value: 85.00
  },
  {
    id: "2",
    clientName: "Emma Johnson",
    rewardName: "30% Off Color Treatment",
    program: "Spa Cashback",
    redeemed: new Date(2023, 8, 15),
    value: 45.00
  },
  {
    id: "3",
    clientName: "Sophia Martinez",
    rewardName: "Free Manicure",
    program: "Haircut Bundle",
    redeemed: new Date(2023, 9, 1),
    value: 35.00
  },
];

const RewardsSection = () => {
  const [rewards] = useState<Reward[]>(mockRewards);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredRewards = rewards.filter((reward) =>
    reward.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Redeemed Rewards</h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">All Rewards ({filteredRewards.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Program</TableHead>
                <TableHead className="hidden md:table-cell">Date Redeemed</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell className="font-medium">{reward.clientName}</TableCell>
                  <TableCell>{reward.rewardName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{reward.program}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(reward.redeemed, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">${reward.value.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {filteredRewards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No rewards found</p>
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

export default RewardsSection;
