export default function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Security Operations Center</h1>
      <p className="text-muted-foreground">Enterprise security monitoring and threat detection.</p>
      
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Active Threats</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-muted-foreground mt-1">No active incidents</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Failed Logins</h3>
          <p className="text-3xl font-bold text-primary">12</p>
          <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Rate Limits Hit</h3>
          <p className="text-3xl font-bold text-primary">3</p>
          <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Suspended Accs</h3>
          <p className="text-3xl font-bold text-orange-500">2</p>
          <p className="text-sm text-muted-foreground mt-1">Requires review</p>
        </div>
      </div>
      
      <div className="p-6 bg-card rounded-xl border shadow-sm min-h-[300px]">
        <h3 className="font-semibold text-lg mb-4">Security Event Timeline</h3>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Incident management and alert log placeholder
        </div>
      </div>
    </div>
  );
}
