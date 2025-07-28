import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Package, 
  Settings as SettingsIcon,
  LogOut,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Home,
  Activity,
  Zap,
  Shield,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Crown,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import appLogo from "@/assets/app-logo.png";

interface Order {
  id: string;
  user_id: string;
  uid: string;
  ign: string;
  package_price: number;
  package_diamonds: number;
  payment_method: string;
  transaction_id?: string;
  payment_proof_url?: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface OfferOrder {
  id: string;
  user_id: string;
  offer_id: string;
  uid: string;
  ign: string;
  payment_method: string;
  transaction_id?: string;
  payment_proof_url?: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
  offers?: {
    name: string;
    price: number;
  };
}

const FuturisticAdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [offerOrders, setOfferOrders] = useState<OfferOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | OfferOrder | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState({
    uptime: "99.9%",
    responseTime: "12ms",
    activeUsers: 1247,
    serverLoad: 68
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch diamond orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch offer orders with offer details
      const { data: offerOrdersData, error: offerOrdersError } = await supabase
        .from('offer_orders')
        .select(`
          *,
          offers (name, price)
        `)
        .order('created_at', { ascending: false });

      if (offerOrdersError) throw offerOrdersError;

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setOrders(ordersData || []);
      setOfferOrders(offerOrdersData || []);
      setUsers(usersData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Simulate real-time updates for system stats
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        responseTime: `${Math.floor(Math.random() * 20 + 10)}ms`,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + Math.floor(Math.random() * 10 - 5)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update user role
  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role Updated",
        description: `User role changed to ${newRole}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string, isOfferOrder = false) => {
    try {
      const table = isOfferOrder ? 'offer_orders' : 'orders';
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      if (isOfferOrder) {
        setOfferOrders(offerOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }

      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Helper functions for order statistics
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-400 animate-glow-pulse';
      case 'processing': return 'text-blue-400 animate-cyber-glow';
      case 'completed': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusCount = (status: string) => {
    const diamondOrders = orders.filter(order => order.status === status).length;
    const offerOrdersCount = offerOrders.filter(order => order.status === status).length;
    return diamondOrders + offerOrdersCount;
  };

  const getTotalRevenue = () => {
    const diamondRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.package_price, 0);
    
    const offerRevenue = offerOrders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + (order.offers?.price || 0), 0);
    
    return diamondRevenue + offerRevenue;
  };

  const allOrders = [
    ...orders.map(order => ({ ...order, type: 'diamond' as const })),
    ...offerOrders.map(order => ({ ...order, type: 'offer' as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative">
        {/* Matrix Background Effect */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-matrix-rain"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${4 + i * 0.1}s`
              }}
            />
          ))}
        </div>
        
        <div className="text-center z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-cyber animate-hologram shadow-cyber"></div>
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-primary animate-glow-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 bg-gradient-neon bg-clip-text text-transparent">
            Initializing Neural Network
          </h2>
          <p className="text-muted-foreground animate-cyber-glow">Accessing admin protocols...</p>
          <div className="mt-4 w-64 h-1 bg-border rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-cyber animate-data-flow rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cyber Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scan Lines */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(15, 85, 55, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 85, 55, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Futuristic Header */}
      <header className="relative bg-gradient-cyber/20 backdrop-blur-md border-b border-primary/30 p-4 sticky top-0 z-50">
        <div className="container mx-auto">
          {/* Top Bar with System Status */}
          <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Wifi className="h-3 w-3 text-green-400 animate-glow-pulse" />
                <span>UPTIME: {systemStats.uptime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-blue-400" />
                <span>LATENCY: {systemStats.responseTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-accent" />
                <span>ACTIVE: {systemStats.activeUsers}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-3 w-3 text-amber-400" />
                <span>LOAD: {systemStats.serverLoad}%</span>
              </div>
            </div>
            <div className="text-xs font-mono">
              NEURAL-NET-v2.0.1 | SECURITY-LEVEL: ULTRA
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={appLogo} alt="FF TopUp Nepal" className="h-12 w-auto" />
                <div className="absolute inset-0 bg-gradient-cyber opacity-20 rounded animate-hologram"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
                  NEURAL COMMAND CENTER
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Crown className="h-4 w-4 text-accent animate-glow-pulse" />
                  Administrator: {profile?.full_name || user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="border-primary/50 hover:shadow-cyber">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  HOME
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 border-red-500/50 text-red-400 hover:shadow-neon"
              >
                <LogOut className="h-4 w-4" />
                DISCONNECT
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Advanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Orders */}
          <Card className="relative overflow-hidden bg-gradient-card/50 backdrop-blur-sm border-amber-500/30 shadow-holographic group hover:shadow-cyber transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/20 rounded-xl backdrop-blur-sm animate-float">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-amber-400 font-mono">PENDING</div>
                  <div className="text-2xl font-bold text-amber-300 animate-glow-pulse">
                    {getStatusCount('pending')}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Queue Status</div>
                <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 animate-data-flow rounded-full"
                    style={{ width: `${Math.min(100, getStatusCount('pending') * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Processing Orders */}
          <Card className="relative overflow-hidden bg-gradient-card/50 backdrop-blur-sm border-blue-500/30 shadow-holographic group hover:shadow-cyber transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm animate-float" style={{ animationDelay: '0.5s' }}>
                  <Zap className="h-6 w-6 text-blue-400 animate-cyber-glow" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-400 font-mono">PROCESSING</div>
                  <div className="text-2xl font-bold text-blue-300">
                    {getStatusCount('processing')}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Neural Activity</div>
                <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-300 animate-data-flow rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Completed Orders */}
          <Card className="relative overflow-hidden bg-gradient-card/50 backdrop-blur-sm border-green-500/30 shadow-holographic group hover:shadow-cyber transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}>
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-400 font-mono">COMPLETED</div>
                  <div className="text-2xl font-bold text-green-300">
                    {getStatusCount('completed')}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Success Rate</div>
                <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-300 w-full rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Revenue */}
          <Card className="relative overflow-hidden bg-gradient-card/50 backdrop-blur-sm border-primary/30 shadow-holographic group hover:shadow-cyber transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/20 rounded-xl backdrop-blur-sm animate-float" style={{ animationDelay: '1.5s' }}>
                  <DollarSign className="h-6 w-6 text-primary animate-hologram" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-primary font-mono">REVENUE</div>
                  <div className="text-2xl font-bold text-primary-glow">
                    Rs {getTotalRevenue().toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Earnings</div>
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last month
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Advanced Navigation Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <div className="relative">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-card/30 backdrop-blur-md border border-primary/20 shadow-cyber">
              <TabsTrigger value="orders" className="flex items-center gap-2 text-primary data-[state=active]:bg-primary/20 data-[state=active]:shadow-neon">
                <Database className="h-4 w-4" />
                TRANSACTION LOGS
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 text-primary data-[state=active]:bg-primary/20 data-[state=active]:shadow-neon">
                <Users className="h-4 w-4" />
                USER MATRIX
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 text-primary data-[state=active]:bg-primary/20 data-[state=active]:shadow-neon">
                <Server className="h-4 w-4" />
                SYSTEM CONFIG
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Orders Tab - Enhanced */}
          <TabsContent value="orders">
            <Card className="relative overflow-hidden bg-gradient-card/50 backdrop-blur-md border border-primary/20 shadow-holographic">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground bg-gradient-neon bg-clip-text text-transparent">
                      NEURAL TRANSACTION MATRIX
                    </h3>
                  </div>
                  <Button 
                    onClick={fetchData} 
                    variant="outline" 
                    size="sm"
                    className="border-primary/50 hover:shadow-cyber"
                  >
                    <Activity className="h-4 w-4 mr-2 animate-glow-pulse" />
                    SYNC DATA
                  </Button>
                </div>

                <div className="rounded-lg border border-primary/20 overflow-hidden shadow-cyber">
                  <Table>
                    <TableHeader className="bg-gradient-card/80 backdrop-blur-sm">
                      <TableRow className="border-primary/20">
                        <TableHead className="text-primary font-mono">NODE.ID</TableHead>
                        <TableHead className="text-primary font-mono">TYPE</TableHead>
                        <TableHead className="text-primary font-mono">USER.IGN</TableHead>
                        <TableHead className="text-primary font-mono">PACKAGE</TableHead>
                        <TableHead className="text-primary font-mono">VALUE</TableHead>
                        <TableHead className="text-primary font-mono">METHOD</TableHead>
                        <TableHead className="text-primary font-mono">STATUS</TableHead>
                        <TableHead className="text-primary font-mono">TIMESTAMP</TableHead>
                        <TableHead className="text-primary font-mono">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allOrders.map((order, index) => (
                        <TableRow 
                          key={order.id} 
                          className="border-primary/10 hover:bg-primary/5 transition-all duration-300"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={order.type === 'diamond' ? 'default' : 'secondary'}
                              className={`${order.type === 'diamond' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary/20 text-secondary border-secondary/30'} animate-cyber-glow`}
                            >
                              {order.type === 'diamond' ? 'DIAMOND' : 'PASS'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-accent">{order.ign}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {order.type === 'diamond' 
                              ? `${(order as Order).package_diamonds} 💎`
                              : (order as OfferOrder).offers?.name || 'Unknown Pass'
                            }
                          </TableCell>
                          <TableCell className="font-semibold text-primary-glow">
                            Rs {order.type === 'diamond' 
                              ? (order as Order).package_price 
                              : (order as OfferOrder).offers?.price || 0
                            }
                          </TableCell>
                          <TableCell className="text-muted-foreground">{order.payment_method}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={order.status === 'completed' ? 'default' : 'secondary'}
                              className={`${getStatusColor(order.status)} border-current/30`}
                            >
                              {order.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                    className="border-primary/50 hover:shadow-neon"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-gradient-card/90 backdrop-blur-md border-primary/30 shadow-holographic">
                                  <DialogHeader>
                                    <DialogTitle className="text-primary bg-gradient-neon bg-clip-text text-transparent">
                                      NEURAL NODE ANALYSIS
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedOrder && (
                                    <div className="grid gap-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label className="text-primary font-mono">NODE.ID</Label>
                                          <p className="font-mono text-sm bg-primary/10 p-2 rounded border border-primary/20">
                                            {selectedOrder.id}
                                          </p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-primary font-mono">USER.IGN</Label>
                                          <p className="bg-accent/10 p-2 rounded border border-accent/20">{selectedOrder.ign}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-primary font-mono">USER.UID</Label>
                                          <p className="bg-secondary/10 p-2 rounded border border-secondary/20">{selectedOrder.uid}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-primary font-mono">PAYMENT.METHOD</Label>
                                          <p className="bg-muted/20 p-2 rounded border border-muted/30">{selectedOrder.payment_method}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label className="text-primary font-mono">STATUS.CONTROL</Label>
                                        <Select
                                          value={selectedOrder.status}
                                          onValueChange={(value) => {
                                            updateOrderStatus(
                                              selectedOrder.id, 
                                              value, 
                                              'offer_id' in selectedOrder
                                            );
                                            setSelectedOrder({ ...selectedOrder, status: value });
                                          }}
                                        >
                                          <SelectTrigger className="bg-gradient-card border-primary/30 shadow-cyber">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-gradient-card border-primary/30">
                                            <SelectItem value="pending">PENDING</SelectItem>
                                            <SelectItem value="processing">PROCESSING</SelectItem>
                                            <SelectItem value="completed">COMPLETED</SelectItem>
                                            <SelectItem value="rejected">REJECTED</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {selectedOrder.notes && (
                                        <div className="space-y-2">
                                          <Label className="text-primary font-mono">SYSTEM.NOTES</Label>
                                          <p className="text-sm text-muted-foreground bg-muted/10 p-3 rounded border border-muted/20">
                                            {selectedOrder.notes}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {order.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, 'completed', order.type === 'offer')}
                                    className="border-green-500/50 hover:shadow-neon"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, 'rejected', order.type === 'offer')}
                                    className="border-red-500/50 hover:shadow-neon"
                                  >
                                    <XCircle className="h-4 w-4 text-red-400" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab - Enhanced */}
          <TabsContent value="users">
            <Card className="relative overflow-hidden bg-gradient-card/50 backdrop-blur-md border border-primary/20 shadow-holographic">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground bg-gradient-neon bg-clip-text text-transparent">
                    USER MANAGEMENT MATRIX
                  </h3>
                </div>
                
                <div className="rounded-lg border border-accent/20 overflow-hidden shadow-cyber">
                  <Table>
                    <TableHeader className="bg-gradient-card/80 backdrop-blur-sm">
                      <TableRow className="border-accent/20">
                        <TableHead className="text-accent font-mono">USER.NAME</TableHead>
                        <TableHead className="text-accent font-mono">EMAIL.ID</TableHead>
                        <TableHead className="text-accent font-mono">ACCESS.LEVEL</TableHead>
                        <TableHead className="text-accent font-mono">JOIN.DATE</TableHead>
                        <TableHead className="text-accent font-mono">PERMISSIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow 
                          key={user.id} 
                          className="border-accent/10 hover:bg-accent/5 transition-all duration-300"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              {user.role === 'admin' && <Crown className="h-4 w-4 text-accent animate-glow-pulse" />}
                              {user.full_name || 'Unknown User'}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono">{user.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.role === 'admin' ? 'default' : 'secondary'}
                              className={`${user.role === 'admin' ? 'bg-accent/20 text-accent border-accent/30 animate-cyber-glow' : 'bg-muted/20 text-muted-foreground border-muted/30'}`}
                            >
                              {user.role.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(value: 'user' | 'admin') => updateUserRole(user.user_id, value)}
                            >
                              <SelectTrigger className="w-32 bg-gradient-card border-accent/30 shadow-cyber">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gradient-card border-accent/30">
                                <SelectItem value="user">USER</SelectItem>
                                <SelectItem value="admin">ADMIN</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab - Enhanced */}
          <TabsContent value="settings">
            <Card className="relative overflow-hidden bg-gradient-card/50 backdrop-blur-md border border-primary/20 shadow-holographic">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Server className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground bg-gradient-neon bg-clip-text text-transparent">
                    SYSTEM CONFIGURATION MATRIX
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="appName" className="text-secondary font-mono">APPLICATION.NAME</Label>
                      <Input
                        id="appName"
                        defaultValue="FF TopUp Nepal"
                        className="bg-gradient-card/50 border-secondary/30 focus:shadow-cyber"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supportContact" className="text-secondary font-mono">SUPPORT.CONTACT</Label>
                      <Input
                        id="supportContact"
                        defaultValue="9827868024"
                        className="bg-gradient-card/50 border-secondary/30 focus:shadow-cyber"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="esewaNumber" className="text-secondary font-mono">ESEWA.GATEWAY</Label>
                      <Input
                        id="esewaNumber"
                        defaultValue="982-7868024"
                        className="bg-gradient-card/50 border-secondary/30 focus:shadow-cyber"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="khaltiNumber" className="text-secondary font-mono">KHALTI.GATEWAY</Label>
                      <Input
                        id="khaltiNumber"
                        defaultValue="982-7633530"
                        className="bg-gradient-card/50 border-secondary/30 focus:shadow-cyber"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imePayNumber" className="text-secondary font-mono">IMEPAY.GATEWAY</Label>
                      <Input
                        id="imePayNumber"
                        defaultValue="9817615513"
                        className="bg-gradient-card/50 border-secondary/30 focus:shadow-cyber"
                      />
                    </div>

                    {/* System Status Display */}
                    <div className="space-y-2">
                      <Label className="text-secondary font-mono">SYSTEM.STATUS</Label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-glow-pulse"></div>
                          <span className="text-green-400">OPERATIONAL</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded border border-blue-500/30">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-cyber-glow"></div>
                          <span className="text-blue-400">SECURE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-primary/20">
                  <Button className="w-full bg-gradient-cyber hover:shadow-holographic text-white font-mono">
                    <Sparkles className="h-4 w-4 mr-2" />
                    APPLY SYSTEM CONFIGURATIONS
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FuturisticAdminDashboard;