import {
  CalendarRange,
  MonitorDot,
  Gauge,
  Box,
  Wrench,
  Zap,
  Building,
  Building2,
  BadgeCheck,
  ScanEye,
  GitBranch,
  Route,
  Boxes,
  Handshake,
  FileSearch,
  Truck,
  PackageCheck,
  HardHat,
  Users,
  Calculator,
  Activity,
  Search,
  ClipboardList
} from 'lucide-react';

export const sectors = [
  {
    id: 'supply-chain-customers',
    name: 'Supply Chain & Customers',
    shortName: 'Supply Chain',
    logo: '/assets/logos/supply-chain.png',
    accentColor: '#10b981',
    agents: [
      { 
        id: 'inventory-buffer', 
        name: 'Inventory Optimization & Buffer System', 
        shortName: 'Inventory', 
        icon: 'Box',
        appUrl: 'https://inventory-managment-agent.vercel.app/'
      },
      { 
        id: 'supplier-risk', 
        name: 'Supplier Performance & Risk System', 
        shortName: 'Suppliers', 
        icon: 'Building2',
        appUrl: 'https://supplier-performance-agent-frontend-sable.vercel.app/'
      },
      { 
        id: 'sourcing-rfq', 
        name: 'Automated Sourcing & RFQ System', 
        shortName: 'Sourcing', 
        icon: 'Search',
        appUrl: 'https://manufacturing-rfq-poc.vercel.app'
      },
      { 
        id: 'logistics-dispatch', 
        name: 'Logistics & Dispatch Tracking System', 
        shortName: 'Logistics', 
        icon: 'Truck',
        appUrl: 'https://logistics-dispatch-gamma.vercel.app/'
      },
      { 
        id: 'order-fulfillment', 
        name: 'Customer Order Fulfillment System', 
        shortName: 'Orders', 
        icon: 'ClipboardList',
        appUrl: 'https://customer-order-management-two.vercel.app/monitoring'
      },
    ],
  },
  {
    id: 'production-planning',
    name: 'Production & Planning',
    shortName: 'Production',
    logo: '/assets/logos/production.png',
    accentColor: '#8b5cf6',
    agents: [
      { 
        id: 'production-planning-system', 
        name: 'Production Planning System', 
        shortName: 'Planning', 
        icon: 'CalendarRange',
        appUrl: 'https://production-planning-khaki.vercel.app/#Overview'
      },
      { 
        id: 'production-monitoring-system', 
        name: 'Production Monitoring System', 
        shortName: 'Monitoring', 
        icon: 'MonitorDot',
        appUrl: null
      },
      { 
        id: 'oee', 
        name: 'Equipment Effectiveness (OEE)', 
        shortName: 'OEE', 
        icon: 'Gauge',
        appUrl: 'https://oee-performance-agent.vercel.app/'
      },
      { 
        id: 'digital-plant-twin', 
        name: 'Digital Plant Twin Simulation', 
        shortName: 'Plant Twin', 
        icon: 'Box',
        appUrl: 'https://digital-twin-frontend-c0ji.onrender.com/'
      },
    ],
  },
  {
    id: 'quality-engineering',
    name: 'Quality & Engineering',
    shortName: 'Quality',
    logo: '/assets/logos/quality.png',
    accentColor: '#0ea5e9',
    agents: [
      { 
        id: 'quality-inspection', 
        name: 'Quality Management & Inspection System', 
        shortName: 'Quality', 
        icon: 'BadgeCheck',
        appUrl: 'https://quality-management-agent-app.vercel.app'
      },
      { 
        id: 'aoi', 
        name: 'Automated Optical Inspection System', 
        shortName: 'AOI', 
        icon: 'ScanEye',
        appUrl: 'https://vision-ai-inspection-agent-app.vercel.app/'
      },
      { 
        id: 'ecn-bom', 
        name: 'Engineering Change & BOM System', 
        shortName: 'ECN & BOM', 
        icon: 'GitBranch',
        appUrl: 'https://manufacturing-ai-frontend.vercel.app'
      },
      { 
        id: 'traceability-genealogy', 
        name: 'Product Traceability & Genealogy System', 
        shortName: 'Traceability', 
        icon: 'Route',
        appUrl: 'https://product-traceability-rho.vercel.app/'
      },
    ],
  },
  {
    id: 'maintenance-utilities',
    name: 'Maintenance & Utilities',
    shortName: 'Maintenance',
    logo: '/assets/logos/maintenance.png',
    accentColor: '#f59e0b',
    agents: [
      { 
        id: 'predictive-maintenance', 
        name: 'Predictive Maintenance System', 
        shortName: 'Predictive Maint.', 
        icon: 'Wrench',
        appUrl: 'https://predictive-maintenance-frontend-kappa.vercel.app/'
      },
      { 
        id: 'energy-tariff', 
        name: 'Energy Management & Tariff System', 
        shortName: 'Energy', 
        icon: 'Zap',
        appUrl: 'https://energy-gules.vercel.app/'
      },
      { 
        id: 'utilities-facilities', 
        name: 'Utilities & Facilities Management', 
        shortName: 'Utilities', 
        icon: 'Building2',
        appUrl: null
      },
    ],
  },
  {
    id: 'finance-leadership',
    name: 'Finance & Leadership',
    shortName: 'Finance',
    logo: '/assets/logos/finance.png',
    accentColor: '#3b82f6',
    agents: [
      {
        id: 'unit-cost',
        name: 'Manufacturing Unit Cost System',
        shortName: 'Unit Cost',
        icon: 'Calculator',
        appUrl: 'https://mfc-agent-frontend.vercel.app/home'
      }
    ],
  },
  {
    id: 'people-safety',
    name: 'People & Safety',
    shortName: 'Safety & People',
    logo: '/assets/logos/people-safety.png',
    accentColor: '#f43f5e',
    agents: [
      { 
        id: 'ehs-safety', 
        name: 'EHS & Plant Safety Management System', 
        shortName: 'EHS & Safety', 
        icon: 'HardHat',
        appUrl: 'https://frontend-dhob.onrender.com'
      },
      { 
        id: 'workforce-skills', 
        name: 'Workforce Allocation & Skills System', 
        shortName: 'Workforce', 
        icon: 'Users',
        appUrl: 'https://workforce-management-navy.vercel.app/'
      },
    ],
  },
];

// Swappable agent icon registry
export const agentIconMap = {
  CalendarRange,
  MonitorDot,
  Gauge,
  Box,
  Wrench,
  Zap,
  Building2: Building2 || Building,
  Building,
  BadgeCheck,
  ScanEye,
  GitBranch,
  Route,
  Boxes,
  Handshake,
  FileSearch,
  Truck,
  PackageCheck,
  HardHat,
  Users,
  Calculator,
  Activity,
  Search,
  ClipboardList
};
