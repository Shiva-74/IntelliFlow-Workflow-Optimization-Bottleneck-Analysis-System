import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { beforeData, afterData, computeMetrics, getTrendData } from "@/lib/data";
import { Clock, AlertTriangle, Truck, Package } from "lucide-react";

const COLORS = {
  blue: "#3B82F0",
  teal: "#14B8A6",
  orange: "#F59E0B",
};
const PIE_COLORS = [COLORS.blue, COLORS.teal, COLORS.orange];

const KpiCard = ({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string }) => (
  <Card className="border-border/50 bg-card shadow-lg">
    <CardContent className="flex items-center gap-4 p-5">
      <div className="rounded-lg p-3" style={{ backgroundColor: color + "22" }}>
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const before = useMemo(() => computeMetrics(beforeData), []);
  const after = useMemo(() => computeMetrics(afterData), []);
  const trendBefore = useMemo(() => getTrendData(beforeData), []);
  const trendAfter = useMemo(() => getTrendData(afterData), []);

  const trendCombined = useMemo(() =>
    trendBefore.map((b, i) => ({
      month: b.month,
      before: b.avgTotal,
      after: trendAfter[i]?.avgTotal ?? 0,
    })), [trendBefore, trendAfter]);

  const comparisonData = useMemo(() =>
    before.stageData.map((s, i) => ({
      stage: s.stage,
      before: s.avgTime,
      after: after.stageData[i].avgTime,
    })), [before, after]);

  const bottleneck = before.stageData.reduce((a, b) => (b.avgTime > a.avgTime ? b : a));
  const improvement = (((before.avgTotal - after.avgTotal) / before.avgTotal) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Workflow Optimization & Bottleneck Analysis System
          </h1>
          <p className="text-sm text-muted-foreground">
            Analyzing order processing pipeline performance across Processing, Packaging & Shipping stages
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard title="Avg Total Time" value={`${before.avgTotal.toFixed(1)}h`} icon={Clock} color={COLORS.teal} />
          <KpiCard title="Delay %" value={`${before.delayPct.toFixed(1)}%`} icon={AlertTriangle} color={COLORS.orange} />
          <KpiCard title="Avg Shipping Time" value={`${before.avgShipping.toFixed(1)}h`} icon={Truck} color={COLORS.blue} />
          <KpiCard title="Total Orders" value={String(before.totalOrders)} icon={Package} color={COLORS.teal} />
        </div>

        {/* Middle Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Bar Chart */}
          <Card className="border-border/50 bg-card shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">Stage-wise Average Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={before.stageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,22%)" />
                  <XAxis dataKey="stage" stroke="hsl(215,20%,60%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,60%)" fontSize={12} unit="h" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222,47%,15%)", border: "1px solid hsl(222,30%,22%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                  <Bar dataKey="avgTime" name="Avg Time (h)" radius={[6, 6, 0, 0]}>
                    {before.stageData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="border-border/50 bg-card shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">Delay Contribution by Stage</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={before.stageData}
                    dataKey="contribution"
                    nameKey="stage"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    strokeWidth={2}
                    stroke="hsl(222,47%,15%)"
                    label={({ stage, contribution }) => `${stage}: ${contribution}%`}
                  >
                    {before.stageData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222,47%,15%)", border: "1px solid hsl(222,30%,22%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Line Chart */}
          <Card className="border-border/50 bg-card shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">Processing Time Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendCombined}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,22%)" />
                  <XAxis dataKey="month" stroke="hsl(215,20%,60%)" fontSize={11} />
                  <YAxis stroke="hsl(215,20%,60%)" fontSize={12} unit="h" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222,47%,15%)", border: "1px solid hsl(222,30%,22%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="before" stroke={COLORS.orange} strokeWidth={2} dot={false} name="Before" />
                  <Line type="monotone" dataKey="after" stroke={COLORS.teal} strokeWidth={2} dot={false} name="After" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparison Chart */}
          <Card className="border-border/50 bg-card shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">Before vs After Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,22%)" />
                  <XAxis dataKey="stage" stroke="hsl(215,20%,60%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,60%)" fontSize={12} unit="h" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222,47%,15%)", border: "1px solid hsl(222,30%,22%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                  <Legend />
                  <Bar dataKey="before" name="Before" fill={COLORS.orange} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="after" name="After" fill={COLORS.teal} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights Panel */}
        <Card className="border-border/50 bg-card shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">📊 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• <span className="font-medium text-accent">{bottleneck.stage}</span> stage is the primary bottleneck, contributing <span className="font-medium text-accent">{bottleneck.contribution}%</span> of total processing time.</p>
            <p>• Optimization reduced overall average processing time by <span className="font-medium text-primary">{improvement}%</span> (from {before.avgTotal.toFixed(1)}h to {after.avgTotal.toFixed(1)}h).</p>
            <p>• Delay rate improved from <span className="font-medium text-accent">{before.delayPct.toFixed(1)}%</span> to <span className="font-medium text-primary">{after.delayPct.toFixed(1)}%</span> after optimization.</p>
            <p>• Shipping time reduced from {before.avgShipping.toFixed(1)}h to {after.avgShipping.toFixed(1)}h — the largest single-stage improvement.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
