export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'critical';

export function getAdminOverview() {
  return {
    stats: [
      { id: 'occupancy', label: 'Occupancy Rate', value: 86, suffix: '%', trend: +4 },
      { id: 'complaints', label: 'Active Complaints', value: 23, suffix: '', trend: -3 },
      { id: 'attendance', label: 'Attendance Today', value: 72, suffix: '%', trend: +2 },
      { id: 'revenue', label: 'Monthly Revenue', value: 128.4, suffix: 'L', trend: +6 }
    ],
    utilities: Array.from({ length: 14 }).map((_, i) => ({ day: `D${i + 1}`, electricity: Math.round(60 + Math.random() * 40), water: Math.round(30 + Math.random() * 25) })),
    complaintsPie: [
      { name: 'Pending', value: 12 },
      { name: 'In Progress', value: 7 },
      { name: 'Resolved', value: 52 },
      { name: 'Critical', value: 4 }
    ],
    canteen: Array.from({ length: 7 }).map((_, i) => ({ day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i], ordered: 180 + Math.round(Math.random() * 60), served: 170 + Math.round(Math.random() * 50) })),
    alerts: [
      { id: 'a1', type: 'security', title: 'Gate 2: Visitor influx', time: '2m ago', urgent: true },
      { id: 'a2', type: 'payment', title: 'Overdue dues crossed ₹1.2L', time: '1h ago', urgent: true },
      { id: 'a3', type: 'complaint', title: 'Water leakage - Block B', time: '3h ago', urgent: false }
    ]
  };
}

export function getResidentOverview(username: string) {
  return {
    stats: [
      { id: 'rent', label: 'Rent Status', value: 'Pending', dueInDays: 5, amount: 8500 },
      { id: 'meals', label: 'Meals Booked Today', value: 2 },
      { id: 'complaints', label: 'Active Complaints', value: 1 }
    ],
    attendance: Array.from({ length: 14 }).map((_, i) => ({ day: `D${i + 1}`, present: Math.random() > 0.25 ? 1 : 0 })),
    usage: Array.from({ length: 14 }).map((_, i) => ({ day: `D${i + 1}`, electricity: Number((4 + Math.random() * 3).toFixed(2)), water: Number((2 + Math.random() * 2).toFixed(2)) })),
    notices: [
      { id: 'n1', title: 'Water maintenance on Thu 2-4pm', time: 'Today' },
      { id: 'n2', title: 'Diwali celebration at Sky Deck 7pm', time: 'Fri' }
    ]
  };
}
