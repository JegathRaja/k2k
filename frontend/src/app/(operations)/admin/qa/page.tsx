export default function QADashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">QA Agent Intelligence</h1>
      <p className="text-muted-foreground">Autonomous testing agent status and reporting.</p>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Latest Run Status</h3>
          <p className="text-3xl font-bold text-green-600">PASSED</p>
          <p className="text-sm text-muted-foreground mt-1">10 minutes ago</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Test Coverage</h3>
          <p className="text-3xl font-bold text-primary">100%</p>
          <p className="text-sm text-muted-foreground mt-1">Critical Paths</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Open Issues</h3>
          <p className="text-3xl font-bold text-muted-foreground">0</p>
          <p className="text-sm text-muted-foreground mt-1">Requires review</p>
        </div>
      </div>
      
      <div className="p-6 bg-card rounded-xl border shadow-sm min-h-[300px]">
        <h3 className="font-semibold text-lg mb-4">Recent Autonomous Test Reports</h3>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Test history table placeholder
        </div>
      </div>
    </div>
  );
}
