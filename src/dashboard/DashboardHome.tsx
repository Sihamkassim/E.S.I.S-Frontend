import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart, Users, Calendar, FileText } from "lucide-react";

export default function DashboardHome() {
  const stats = [
    {
      title: "Total Projects",
      value: "150+",
      icon: BarChart,
      trend: "+12.5%",
      description: "from last month"
    },
    {
      title: "Active Members",
      value: "2.4k",
      icon: Users,
      trend: "+5.25%",
      description: "from last month"
    },
    {
      title: "Upcoming Events",
      value: "24",
      icon: Calendar,
      trend: "+3 events",
      description: "this week"
    },
    {
      title: "Support Tickets",
      value: "85%",
      icon: FileText,
      trend: "+2.3%",
      description: "resolution rate"
    }
  ];

  const recentActivities = [
    {
      type: "Project Submission",
      title: "AI-Powered Healthcare Solution",
      user: "Sarah Chen",
      date: "2 hours ago"
    },
    {
      type: "Webinar Registration",
      title: "Blockchain Technology in 2024",
      user: "Michael Brown",
      date: "5 hours ago"
    },
    {
      type: "Startup Application",
      title: "EcoTech Solutions",
      user: "David Wilson",
      date: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to E.S.I.S Portal</h1>
        <p className="text-blue-100">Your gateway to innovation and technological advancement</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <stat.icon className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500 font-medium">{stat.trend}</span>
              <span className="ml-2 text-gray-600">{stat.description}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{activity.type}</TableCell>
                <TableCell className="font-medium">{activity.title}</TableCell>
                <TableCell>{activity.user}</TableCell>
                <TableCell>{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
