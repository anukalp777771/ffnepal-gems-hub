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
  Home
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

const AdminDashboardUpdated = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [offerOrders, setOfferOrders] = useState<OfferOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | OfferOrder | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      case 'pending': return 'text-amber-500';
      case 'processing': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={appLogo} alt="FF TopUp Nepal" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {profile?.full_name || user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-amber-500/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-foreground">{getStatusCount('pending')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-blue-500/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-foreground">{getStatusCount('processing')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-green-500/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{getStatusCount('completed')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-primary/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">Rs {getTotalRevenue()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6 bg-gradient-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
                <Button onClick={fetchData} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>

              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>IGN</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <Badge variant={order.type === 'diamond' ? 'default' : 'secondary'}>
                            {order.type === 'diamond' ? 'Diamond' : 'Pass'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{order.ign}</TableCell>
                        <TableCell>
                          {order.type === 'diamond' 
                            ? `${(order as Order).package_diamonds} Diamonds`
                            : (order as OfferOrder).offers?.name || 'Unknown Pass'
                          }
                        </TableCell>
                        <TableCell className="font-semibold">
                          Rs {order.type === 'diamond' 
                            ? (order as Order).package_price 
                            : (order as OfferOrder).offers?.price || 0
                          }
                        </TableCell>
                        <TableCell>{order.payment_method}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={order.status === 'completed' ? 'default' : 'secondary'}
                            className={getStatusColor(order.status)}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
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
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Order ID</Label>
                                        <p className="font-mono text-sm">{selectedOrder.id}</p>
                                      </div>
                                      <div>
                                        <Label>IGN</Label>
                                        <p>{selectedOrder.ign}</p>
                                      </div>
                                      <div>
                                        <Label>UID</Label>
                                        <p>{selectedOrder.uid}</p>
                                      </div>
                                      <div>
                                        <Label>Payment Method</Label>
                                        <p>{selectedOrder.payment_method}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Status</Label>
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
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="processing">Processing</SelectItem>
                                          <SelectItem value="completed">Completed</SelectItem>
                                          <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {selectedOrder.notes && (
                                      <div>
                                        <Label>Notes</Label>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
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
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'rejected', order.type === 'offer')}
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
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
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="p-6 bg-gradient-card">
              <h3 className="text-lg font-semibold text-foreground mb-6">User Management</h3>
              
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'No name'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value: 'user' | 'admin') => updateUserRole(user.user_id, value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6 bg-gradient-card">
              <h3 className="text-lg font-semibold text-foreground mb-6">App Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="appName">App Name</Label>
                  <Input
                    id="appName"
                    defaultValue="FF TopUp Nepal"
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="supportContact">Support Contact</Label>
                  <Input
                    id="supportContact"
                    defaultValue="9827868024"
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="esewaNumber">eSewa Number</Label>
                  <Input
                    id="esewaNumber"
                    defaultValue="982-7868024"
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="khaltiNumber">Khalti Number</Label>
                  <Input
                    id="khaltiNumber"
                    defaultValue="982-7633530"
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="imePayNumber">IME Pay Number</Label>
                  <Input
                    id="imePayNumber"
                    defaultValue="9817615513"
                    className="bg-background border-border"
                  />
                </div>

                <Button variant="gaming" className="w-full">
                  Save Settings
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardUpdated;