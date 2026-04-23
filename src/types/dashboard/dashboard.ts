export interface DashboardKpis {
  currentMonthRevenue: number;
  currentGuests: number;
  totalUnits: number;
  occupancyRate: number;
  bookedUnits: number;
  cleaningUnits: number;
  maintenanceUnits: number;
}

export interface TodayFocusItem {
  bookingId: string;
  guestName: string;
  projectName: string;
  unitName: string;
}

export interface UpcomingBookingSummary {
  bookingId: string;
  guestName: string;
  projectName: string;
  unitName: string;
  checkInDate: string;
  totalPrice: number;
}

export interface EmployeePerformance {
  dailyBookings: number;
  dailyCompleted: number;
  dailyRate: number;
  dailyTarget: number;
  weeklyBookings: number;
  weeklyCompleted: number;
  weeklyRate: number;
  weeklyTarget: number;
}

export interface DashboardSummary {
  kpis: DashboardKpis;
  todayFocus: {
    arrivals: TodayFocusItem[];
    departures: TodayFocusItem[];
    pendingCheckins: TodayFocusItem[];
  };
  upcomingBookings: UpcomingBookingSummary[];
  employeePerformance: EmployeePerformance | null;
}
