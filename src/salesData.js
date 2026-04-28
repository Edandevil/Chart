// Extracted from sales.txt — Month to Date (2026-04-01 to 2026-04-21)
export const sales = {
  kpi: {
    total_orders: 13301,
    total_revenue: 1001925300,
    average_order_value: 75327,
    unique_customers: 6206,
    delivered_orders: 11424,
    cancelled_orders: 1850,
    fulfillment_rate: 85.89
  },
  warehouseShare: [
    { warehouse_id: 1, order_count: 6371, revenue: 552947400, revenue_share_pct: 55.19 },
    { warehouse_id: 2, order_count: 2642, revenue: 137229700, revenue_share_pct: 13.7 },
    { warehouse_id: 3, order_count: 1040, revenue: 95513800, revenue_share_pct: 9.53 },
    { warehouse_id: 18, order_count: 1102, revenue: 56448200, revenue_share_pct: 5.63 },
    { warehouse_id: 20, order_count: 671, revenue: 50321500, revenue_share_pct: 5.02 },
    { warehouse_id: 13, order_count: 685, revenue: 45630700, revenue_share_pct: 4.55 },
    { warehouse_id: 10, order_count: 321, revenue: 31680400, revenue_share_pct: 3.16 },
    { warehouse_id: 16, order_count: 463, revenue: 31413800, revenue_share_pct: 3.14 }
  ],
  statusDistribution: [
    { order_status: "delivered", order_count: 11424, percentage: 85.89 },
    { order_status: "cancelled", order_count: 1850, percentage: 13.91 },
    { order_status: "other", order_count: 27, percentage: 0.2 }
  ],
  dailyTrends: [
    { date: "2026-04-20", orders: 679, revenue: 45502000 },
    { date: "2026-04-19", orders: 711, revenue: 47119400 },
    { date: "2026-04-18", orders: 712, revenue: 49911600 },
    { date: "2026-04-17", orders: 1003, revenue: 86092800 },
    { date: "2026-04-16", orders: 673, revenue: 48205100 },
    { date: "2026-04-15", orders: 722, revenue: 54332400 },
    { date: "2026-04-14", orders: 1097, revenue: 92224000 },
    { date: "2026-04-13", orders: 724, revenue: 56055300 },
    { date: "2026-04-12", orders: 580, revenue: 42869800 },
    { date: "2026-04-11", orders: 711, revenue: 48066500 }
  ],
  topProducts: [
    { name: "Chicken Matka Biryani (Double)", orders: 315, revenue: 19665000 },
    { name: "Chicken Steam Momo", orders: 617, revenue: 17533000 },
    { name: "Chicken Biryani", orders: 225, revenue: 10860200 },
    { name: "KFC Wednesday Offer", orders: 87, revenue: 10110800 },
    { name: "Butter Naan", orders: 382, revenue: 9669200 },
    { name: "Matka Biryani (Family Pack)", orders: 70, revenue: 8510000 },
    { name: "Chicken Pizza", orders: 136, revenue: 7923300 }
  ],
  paymentMethods: [
    { method: "Cash On Delivery", transactions: 11929, success_rate: 19.72, revenue: 783123500 },
    { method: "Esewa", transactions: 1197, success_rate: 98.08, revenue: 87382300 },
    { method: "Visa/Master Card", transactions: 132, success_rate: 99.24, revenue: 17455300 },
    { method: "Khalti", transactions: 35, success_rate: 97.14, revenue: 2065400 }
  ]
};
