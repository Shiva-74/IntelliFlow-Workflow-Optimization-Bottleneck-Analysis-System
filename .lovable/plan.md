

# Workflow Optimization & Bottleneck Analysis Dashboard

## Overview
Build a professional, interactive dashboard that simulates an order processing workflow analysis system. It will generate realistic datasets, identify bottlenecks, and show before/after optimization comparisons — all rendered as a web-based dashboard.

## Data Generation
- Generate 300 rows of **Before_Process** data (Order_ID, Order_Date, Processing_Time 1–4h, Packaging_Time 2–5h, Shipping_Time 4–8h, Total_Time, Status)
- Generate matching **After_Process** data with reduced Shipping_Time (2–5h) and slightly improved Packaging_Time
- Status: "Delayed" if Total_Time > 10, else "On-Time"

## Dashboard Layout

### Header
- Title: "Workflow Optimization & Bottleneck Analysis System"
- Subtitle with project context

### Top Section — KPI Cards
Four rounded cards with shadows showing:
- Average Total Time
- Delay Percentage
- Average Shipping Time
- Total Orders Count

### Middle Section — Analysis (2 columns)
- **Left**: Bar chart — average time per stage (Processing, Packaging, Shipping)
- **Right**: Pie/donut chart — each stage's contribution to total delay

### Bottom Section — Trends & Comparison (2 columns)
- **Left**: Line chart — total processing time trend over time
- **Right**: Grouped bar chart — Before vs After comparison per stage

### Insights Panel
- Auto-generated text insights identifying bottleneck stage, delay contribution %, and improvement metrics

## Design
- Color theme: Dark Blue (#1E3A8A), Teal (#14B8A6), Orange (#F59E0B)
- Dark-themed dashboard with rounded cards, shadows, clean spacing
- Professional business analytics look using Recharts for visualizations

