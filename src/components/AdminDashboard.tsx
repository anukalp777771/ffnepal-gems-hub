import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Settings, 
  Package, 
  Users, 
  DollarSign, 
  Eye, 
  Check, 
  X, 
  Clock,
  Edit,
  Trash2,
  Plus,
  Download,
  MessageSquare
} from "lucide-react";

// Mock data - in real app, this would come from your backend
const mockOrders = [
  {
    id: "ORD001",
    uid: "123456789",
    ign: "ProGamer",
    package: "480 Diamonds",
    amount: 410,
    paymentMethod: "eSewa",
    status: "pending",
    timestamp: "2024-01-15 14:30:00",
    screenshot: "/payment-proof.jpg"
  },
  {
    id: "ORD002",
    uid: "987654321",
    ign: "FireKing",
    package: "1090 Diamonds",
    amount: 910,
    paymentMethod: "Khalti",
    status: "completed",
    timestamp: "2024-01-15 13:45:00",
    screenshot: "/payment-proof2.jpg"
  },
  {
    id: "ORD003",
    uid: "456789123",
    ign: "NepalWarrior",
    package: "Weekly Pass",
    amount: 220,
    paymentMethod: "IME Pay",
    status: "processing",
    timestamp: "2024-01-15 12:20:00",
    screenshot: "/payment-proof3.jpg"
  }
];

const AdminDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const handleLogin = () => {
    // Simple authentication - in real app, this would be proper authentication
    if (loginForm.username === "admin" && loginForm.password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === "completed")
      .reduce((total, order) => total + order.amount, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-gradient-card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground">Access the admin dashboard</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <Button onClick={handleLogin} variant="gaming" className="w-full">
              Login
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Demo: admin / admin123
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">FF TopUp Nepal Management</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsAuthenticated(false)} 
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-primary/30">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">{getStatusCount("pending")}</div>
                <div className="text-sm text-muted-foreground">Pending Orders</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-blue-500/30">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">{getStatusCount("processing")}</div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-green-500/30">
            <div className="flex items-center gap-3">
              <Check className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">{getStatusCount("completed")}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-accent/30">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-accent" />
              <div>
                <div className="text-2xl font-bold text-foreground">Rs {getTotalRevenue()}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Order Management</h2>
              <Button variant="gaming">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 bg-gradient-card border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold text-foreground">Order #{order.id}</div>
                        <div className="text-sm text-muted-foreground">{order.timestamp}</div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">Rs {order.amount}</div>
                      <div className="text-sm text-muted-foreground">{order.paymentMethod}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">UID</div>
                      <div className="font-medium text-foreground">{order.uid}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">IGN</div>
                      <div className="font-medium text-foreground">{order.ign}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Package</div>
                      <div className="font-medium text-foreground">{order.package}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Screenshot
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Payment Screenshot - {order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                          <img 
                            src={order.screenshot} 
                            alt="Payment proof" 
                            className="w-full rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {order.status === "pending" && (
                      <>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "processing")}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "rejected")}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {order.status === "processing" && (
                      <Button 
                        variant="gaming" 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "completed")}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    )}
                    
                    <Button variant="secondary" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="packages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Package Management</h2>
              <Button variant="gaming">
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Button>
            </div>
            
            <Card className="p-6 bg-gradient-card">
              <div className="text-center text-muted-foreground">
                Package management interface would go here. 
                You can add/edit/delete diamond packages and special offers.
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">User Management</h2>
            </div>
            
            <Card className="p-6 bg-gradient-card">
              <div className="text-center text-muted-foreground">
                User management interface would go here.
                View customer details, order history, and support tickets.
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">App Settings</h2>
            </div>
            
            <div className="grid gap-6">
              <Card className="p-6 bg-gradient-card">
                <h3 className="text-lg font-bold text-foreground mb-4">App Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appName">App Name</Label>
                    <Input id="appName" defaultValue="FF TopUp Nepal" />
                  </div>
                  <div>
                    <Label htmlFor="supportWhatsApp">Support WhatsApp</Label>
                    <Input id="supportWhatsApp" defaultValue="9827868024" />
                  </div>
                  <Button variant="gaming">Save Changes</Button>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-card">
                <h3 className="text-lg font-bold text-foreground mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="esewa">eSewa Number</Label>
                    <Input id="esewa" defaultValue="982-7868024" />
                  </div>
                  <div>
                    <Label htmlFor="khalti">Khalti Number</Label>
                    <Input id="khalti" defaultValue="982-7633530" />
                  </div>
                  <div>
                    <Label htmlFor="imepay">IME Pay Number</Label>
                    <Input id="imepay" defaultValue="9817615513" />
                  </div>
                  <Button variant="gaming">Update Payment Info</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;