// Seeded random for reproducibility
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function randBetween(rng: () => number, min: number, max: number) {
  return +(min + rng() * (max - min)).toFixed(1);
}

export interface OrderRow {
  Order_ID: string;
  Order_Date: string;
  Processing_Time: number;
  Packaging_Time: number;
  Shipping_Time: number;
  Total_Time: number;
  Status: "Delayed" | "On-Time";
}

function generateDataset(
  count: number,
  processingRange: [number, number],
  packagingRange: [number, number],
  shippingRange: [number, number],
  seed: number
): OrderRow[] {
  const rng = seededRandom(seed);
  const startDate = new Date("2024-01-01");
  const rows: OrderRow[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate.getTime() + i * 86400000 * (365 / count));
    const p = randBetween(rng, ...processingRange);
    const pk = randBetween(rng, ...packagingRange);
    const s = randBetween(rng, ...shippingRange);
    const total = +(p + pk + s).toFixed(1);
    rows.push({
      Order_ID: `ORD-${String(i + 1).padStart(4, "0")}`,
      Order_Date: date.toISOString().split("T")[0],
      Processing_Time: p,
      Packaging_Time: pk,
      Shipping_Time: s,
      Total_Time: total,
      Status: total > 10 ? "Delayed" : "On-Time",
    });
  }
  return rows;
}

export const beforeData = generateDataset(300, [1, 4], [2, 5], [4, 8], 42);
export const afterData = generateDataset(300, [1, 4], [1.5, 4], [2, 5], 42);

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function computeMetrics(data: OrderRow[]) {
  const avgProcessing = avg(data.map((d) => d.Processing_Time));
  const avgPackaging = avg(data.map((d) => d.Packaging_Time));
  const avgShipping = avg(data.map((d) => d.Shipping_Time));
  const avgTotal = avg(data.map((d) => d.Total_Time));
  const delayPct = (data.filter((d) => d.Status === "Delayed").length / data.length) * 100;
  const totalDelayTime = avgProcessing + avgPackaging + avgShipping;

  return {
    avgProcessing,
    avgPackaging,
    avgShipping,
    avgTotal,
    delayPct,
    totalOrders: data.length,
    stageData: [
      { stage: "Processing", avgTime: +avgProcessing.toFixed(2), contribution: +((avgProcessing / totalDelayTime) * 100).toFixed(1) },
      { stage: "Packaging", avgTime: +avgPackaging.toFixed(2), contribution: +((avgPackaging / totalDelayTime) * 100).toFixed(1) },
      { stage: "Shipping", avgTime: +avgShipping.toFixed(2), contribution: +((avgShipping / totalDelayTime) * 100).toFixed(1) },
    ],
  };
}

export function getTrendData(data: OrderRow[]) {
  // Group by month
  const months: Record<string, number[]> = {};
  data.forEach((d) => {
    const month = d.Order_Date.substring(0, 7);
    if (!months[month]) months[month] = [];
    months[month].push(d.Total_Time);
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, times]) => ({
      month,
      avgTotal: +(times.reduce((a, b) => a + b, 0) / times.length).toFixed(2),
    }));
}
