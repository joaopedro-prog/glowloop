
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for charts
const visitData = [
  { name: "Jan", visits: 20 },
  { name: "Feb", visits: 25 },
  { name: "Mar", visits: 30 },
  { name: "Apr", visits: 22 },
  { name: "May", visits: 28 },
  { name: "Jun", visits: 35 },
  { name: "Jul", visits: 32 },
  { name: "Aug", visits: 40 },
  { name: "Sep", visits: 45 },
  { name: "Oct", visits: 48 },
];

const rewardData = [
  { name: "Jan", rewards: 2 },
  { name: "Feb", rewards: 3 },
  { name: "Mar", rewards: 5 },
  { name: "Apr", rewards: 4 },
  { name: "May", rewards: 6 },
  { name: "Jun", rewards: 8 },
  { name: "Jul", rewards: 7 },
  { name: "Aug", rewards: 10 },
  { name: "Sep", rewards: 12 },
  { name: "Oct", rewards: 15 },
];

const ReportsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-glow-pink">53</div>
            <p className="text-xs text-muted-foreground">Total registered clients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-aqua-suave">48</div>
            <p className="text-xs text-muted-foreground">Visits this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mint">15</div>
            <p className="text-xs text-muted-foreground">Rewards redeemed</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Visits</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#FF89BB" 
                  strokeWidth={2} 
                  dot={{ stroke: '#FF89BB', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rewards Redeemed</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rewardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="rewards" 
                  fill="#7EE8FA" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsSection;
