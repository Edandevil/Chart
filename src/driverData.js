// Extracted from Driver.txt — Last Week (2026-04-13 to 2026-04-19)
export const drv = {
  period: 'Last Week (2026-04-13 to 2026-04-19)',

  // Workforce summary
  workforce: { total_drivers: 28, active_drivers: 13, verified_drivers: 28, verification_rate_pct: 100.0, total_deliveries: 66342, avg_deliveries_per_active_driver: 5103.23 },

  // Status breakdown
  statusBreakdown: [
    { label: 'Inactive / Verified', is_active: false, is_verified: true, driver_count: 15, deliveries_handled: 18154, pct_of_workforce: 53.57 },
    { label: 'Active / Verified',   is_active: true,  is_verified: true, driver_count: 13, deliveries_handled: 48188, pct_of_workforce: 46.43 },
  ],

  // Warehouse performance
  byWarehouse: [
    { warehouse_id: 1,  drivers_count: 12, active_drivers: 9, verified_drivers: 12, total_deliveries: 37770, avg_deliveries_per_driver: 4196.67 },
    { warehouse_id: 10, drivers_count: 2,  active_drivers: 2, verified_drivers: 2,  total_deliveries: 8706,  avg_deliveries_per_driver: 4353.0  },
    { warehouse_id: 18, drivers_count: 2,  active_drivers: 1, verified_drivers: 2,  total_deliveries: 7736,  avg_deliveries_per_driver: 7736.0  },
    { warehouse_id: 2,  drivers_count: 3,  active_drivers: 0, verified_drivers: 3,  total_deliveries: 6130,  avg_deliveries_per_driver: null    },
    { warehouse_id: 13, drivers_count: 5,  active_drivers: 0, verified_drivers: 5,  total_deliveries: 4424,  avg_deliveries_per_driver: null    },
    { warehouse_id: 16, drivers_count: 2,  active_drivers: 0, verified_drivers: 2,  total_deliveries: 1182,  avg_deliveries_per_driver: null    },
    { warehouse_id: 20, drivers_count: 1,  active_drivers: 0, verified_drivers: 1,  total_deliveries: 344,   avg_deliveries_per_driver: null    },
    { warehouse_id: 3,  drivers_count: 1,  active_drivers: 1, verified_drivers: 1,  total_deliveries: 50,    avg_deliveries_per_driver: 50.0    },
  ],

  // Top performers (last_week)
  topDrivers: [
    { driver_id: 314, first_name: 'Darshan', last_name: 'Ranabhat', warehouse_id: 1,  is_active: true,  total_deliveries: 206, pct_of_total: 57.22, delivery_rank: 1 },
    { driver_id: 316, first_name: 'Samir',   last_name: 'Tiwari',   warehouse_id: 1,  is_active: true,  total_deliveries: 74,  pct_of_total: 20.56, delivery_rank: 2 },
    { driver_id: 317, first_name: 'sumit',   last_name: 'chidi',    warehouse_id: 3,  is_active: true,  total_deliveries: 50,  pct_of_total: 13.89, delivery_rank: 3 },
    { driver_id: 313, first_name: 'Arbind',  last_name: 'Raut',     warehouse_id: 13, is_active: false, total_deliveries: 22,  pct_of_total: 6.11,  delivery_rank: 4 },
    { driver_id: 315, first_name: 'Irfan',   last_name: 'Hussain',  warehouse_id: 13, is_active: false, total_deliveries: 8,   pct_of_total: 2.22,  delivery_rank: 5 },
  ],

  // Workload anomalies
  workloadAlerts: [
    { driver_id: 314, first_name: 'Darshan', last_name: 'Ranabhat', warehouse_id: 1, is_active: true, delivery_count: 206, fleet_avg: 72.0, workload_status: 'Overloaded', z_score: 1.69 },
  ],

  // Workload distribution summary
  workloadSummary: { total_drivers: 3, drivers_with_deliveries: 3, min_deliveries: 8, max_deliveries: 206, avg_deliveries: 78.67, median_deliveries: 22.0, std_dev_deliveries: 110.5 },

  // Percentile distribution
  percentiles: [
    { percentile: 'P10', delivery_threshold: 10.8 },
    { percentile: 'P25', delivery_threshold: 15.0 },
    { percentile: 'P50 (Median)', delivery_threshold: 22.0 },
    { percentile: 'P75', delivery_threshold: 114.0 },
    { percentile: 'P90', delivery_threshold: 169.2 },
    { percentile: 'P95', delivery_threshold: 187.6 },
    { percentile: 'P99', delivery_threshold: 202.32 },
  ],

  // Hourly activity pattern (last_week)
  hourlyActivity: [
    { hour: 0,  pings: 117,   active_drivers: 5,  avg: 23.4 },
    { hour: 2,  pings: 657,   active_drivers: 10, avg: 65.7 },
    { hour: 3,  pings: 5571,  active_drivers: 27, avg: 206.33 },
    { hour: 4,  pings: 21242, active_drivers: 38, avg: 559.0 },
    { hour: 5,  pings: 29314, active_drivers: 51, avg: 574.78 },
    { hour: 6,  pings: 30382, active_drivers: 52, avg: 584.27 },
    { hour: 7,  pings: 30786, active_drivers: 60, avg: 513.1 },
    { hour: 8,  pings: 37703, active_drivers: 57, avg: 661.46 },
    { hour: 9,  pings: 53215, active_drivers: 56, avg: 950.27 },
    { hour: 10, pings: 50189, active_drivers: 57, avg: 880.51 },
    { hour: 11, pings: 62312, active_drivers: 54, avg: 1153.93 },
    { hour: 12, pings: 60700, active_drivers: 58, avg: 1046.55 },
    { hour: 13, pings: 72798, active_drivers: 58, avg: 1255.14 },
    { hour: 14, pings: 90936, active_drivers: 57, avg: 1595.37 },
    { hour: 15, pings: 89815, active_drivers: 63, avg: 1425.63 },
    { hour: 16, pings: 59758, active_drivers: 59, avg: 1012.85 },
    { hour: 17, pings: 21857, active_drivers: 32, avg: 683.03 },
    { hour: 18, pings: 4247,  active_drivers: 21, avg: 202.24 },
    { hour: 19, pings: 545,   active_drivers: 11, avg: 49.55 },
    { hour: 20, pings: 311,   active_drivers: 7,  avg: 44.43 },
    { hour: 22, pings: 469,   active_drivers: 6,  avg: 78.17 },
    { hour: 23, pings: 249,   active_drivers: 5,  avg: 49.8 },
  ],

  // Daily trend (last_week, sorted asc)
  dailyTrend: [
    { date: '04-13', pings: 112021, active_drivers: 56, avg_pings: 2000.38 },
    { date: '04-14', pings: 140327, active_drivers: 58, avg_pings: 2419.43 },
    { date: '04-15', pings: 97633,  active_drivers: 49, avg_pings: 1992.51 },
    { date: '04-16', pings: 110871, active_drivers: 52, avg_pings: 2132.13 },
    { date: '04-17', pings: 151688, active_drivers: 53, avg_pings: 2862.04 },
    { date: '04-18', pings: 110912, active_drivers: 52, avg_pings: 2132.92 },
  ],

  // Day of week pattern
  dayOfWeek: [
    { day_name: 'Mon', pings: 112021, unique_drivers: 56 },
    { day_name: 'Tue', pings: 140327, unique_drivers: 58 },
    { day_name: 'Wed', pings: 97633,  unique_drivers: 49 },
    { day_name: 'Thu', pings: 110871, unique_drivers: 52 },
    { day_name: 'Fri', pings: 151688, unique_drivers: 53 },
    { day_name: 'Sat', pings: 110912, unique_drivers: 52 },
  ],

  // Productivity tier
  productivityTiers: [
    { tier: 'Low Performer (<1k)', driver_count: 3, min: 50, max: 206, avg: 110.0 },
  ],

  // Month-to-date top drivers (richer list for table)
  topDriversMTD: [
    { driver_id: 311, name: 'sujan rider',     warehouse_id: 1,  is_active: true,  total_deliveries: 726, pct: 45.43, rank: 1 },
    { driver_id: 312, name: 'Rider Bijay',     warehouse_id: 3,  is_active: true,  total_deliveries: 512, pct: 32.04, rank: 2 },
    { driver_id: 314, name: 'Darshan Ranabhat',warehouse_id: 1,  is_active: true,  total_deliveries: 206, pct: 12.89, rank: 3 },
    { driver_id: 316, name: 'Samir Tiwari',    warehouse_id: 1,  is_active: true,  total_deliveries: 74,  pct: 4.63,  rank: 4 },
    { driver_id: 317, name: 'sumit chidi',     warehouse_id: 3,  is_active: true,  total_deliveries: 50,  pct: 3.13,  rank: 5 },
    { driver_id: 313, name: 'Arbind Raut',     warehouse_id: 13, is_active: false, total_deliveries: 22,  pct: 1.38,  rank: 6 },
    { driver_id: 315, name: 'Irfan Hussain',   warehouse_id: 13, is_active: false, total_deliveries: 8,   pct: 0.50,  rank: 7 },
  ],
};
