export default function HealthDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">System Health Monitor</h1>
      <p className="text-muted-foreground">Centralized monitoring for Frontend, Backend, Database, and Realtime services.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">API Latency</h3>
          <p className="text-3xl font-bold text-green-600">45ms</p>
          <p className="text-sm text-muted-foreground mt-1">Healthy</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">DB Connections</h3>
          <p className="text-3xl font-bold text-primary">12 / 100</p>
          <p className="text-sm text-muted-foreground mt-1">Pool Status: Normal</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Queue Health</h3>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-sm text-muted-foreground mt-1">Pending Jobs</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Error Rate (5xx)</h3>
          <p className="text-3xl font-bold text-green-600">0.01%</p>
          <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
        </div>
      </div>
      
      <div className="p-6 bg-card rounded-xl border shadow-sm min-h-[300px]">
        <h3 className="font-semibold text-lg mb-4">Service Status Matrix</h3>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Service status grid placeholder
        </div>
      </div>
    </div>
  );
}
