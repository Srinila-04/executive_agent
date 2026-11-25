import urllib.request
import re
import json
import os

agents = {
  'production_planning': {'name': 'Production Planning Agent', 'url': 'https://production-planning-khaki.vercel.app/#Overview', 'base': 'https://production-planning-khaki.vercel.app'},
  'oee_performance': {'name': 'OEE Performance Agent', 'url': 'https://oee-performance-agent.vercel.app/', 'base': 'https://oee-performance-agent.vercel.app'},
  'predictive_maintenance': {'name': 'Predictive Maintenance Agent', 'url': 'https://predictive-maintenance-frontend-kappa.vercel.app/', 'base': 'https://predictive-maintenance-frontend-kappa.vercel.app'},
  'quality_management': {'name': 'Quality Management Agent', 'url': 'https://quality-management-agent-app.vercel.app', 'base': 'https://quality-management-agent-app.vercel.app'},
  'vision_ai_inspection': {'name': 'Vision AI Inspection Agent', 'url': 'https://vision-ai-inspection-agent-app.vercel.app/', 'base': 'https://vision-ai-inspection-agent-app.vercel.app'},
  'engineering_change': {'name': 'Engineering Change Management Agent', 'url': 'https://manufacturing-ai-frontend.vercel.app', 'base': 'https://manufacturing-ai-frontend.vercel.app'},
  'product_traceability': {'name': 'Product Traceability Agent', 'url': 'https://product-traceability-rho.vercel.app/', 'base': 'https://product-traceability-rho.vercel.app'},
  'inventory_management': {'name': 'Inventory Management Agent', 'url': 'https://inventory-managment-agent.vercel.app/', 'base': 'https://inventory-managment-agent.vercel.app'},
  'supplier_performance': {'name': 'Supplier Performance Agent', 'url': 'https://supplier-performance-agent-frontend-sable.vercel.app/', 'base': 'https://supplier-performance-agent-frontend-sable.vercel.app'},
  'agentic_rfq': {'name': 'Agentic RFQ Management Agent', 'url': 'https://manufacturing-rfq-poc.vercel.app', 'base': 'https://manufacturing-rfq-poc.vercel.app'},
  'logistics_dispatch': {'name': 'Logistics and Dispatch Agent', 'url': 'https://logistics-dispatch-gamma.vercel.app/', 'base': 'https://logistics-dispatch-gamma.vercel.app'},
  'energy_management': {'name': 'Energy Management Agent', 'url': 'https://energy-gules.vercel.app/', 'base': 'https://energy-gules.vercel.app'},
  'ehs_safety': {'name': 'EHS and Safety Agent', 'url': 'https://frontend-dhob.onrender.com', 'base': 'https://frontend-dhob.onrender.com'},
  'workforce_management': {'name': 'Workforce Management Agent', 'url': 'https://workforce-management-navy.vercel.app/', 'base': 'https://workforce-management-navy.vercel.app'},
  'manufacturing_cost': {'name': 'Manufacturing Cost Agent', 'url': 'https://mfc-agent-frontend.vercel.app/home', 'base': 'https://mfc-agent-frontend.vercel.app'},
  'customer_order': {'name': 'Customer Order Management Agent', 'url': 'https://customer-order-management-two.vercel.app/monitoring', 'base': 'https://customer-order-management-two.vercel.app'},
  'digital_twin': {'name': 'Digital Twin Agent', 'url': 'https://digital-twin-frontend-c0ji.onrender.com/', 'base': 'https://digital-twin-frontend-c0ji.onrender.com'}
}

results = {}

for key, info in agents.items():
    print(f"Checking {info['name']}...")
    try:
        req = urllib.request.Request(info['url'], headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            title_match = re.search(r'<title>(.*?)</title>', html, re.I)
            title = title_match.group(1).strip() if title_match else ''
            
            # Find script bundles
            script_srcs = re.findall(r'src=["\']([^"\']+\.js[^"\']*)["\']', html)
            
            # Fetch the main JS bundles (up to 3) to analyze routes, APIs, KPIs, and charts
            js_snippets = []
            api_endpoints = set()
            routes = set()
            kpi_mentions = set()
            
            for s in script_srcs[:3]:
                if not s.startswith('http'):
                    script_url = info['base'].rstrip('/') + '/' + s.lstrip('/')
                else:
                    script_url = s
                try:
                    s_req = urllib.request.Request(script_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(s_req, timeout=10) as s_resp:
                        js = s_resp.read().decode('utf-8', errors='ignore')
                        # Search for routes
                        found_routes = re.findall(r'path:\s*["\'](/[a-zA-Z0-9_\-\/]+)["\']', js)
                        found_routes += re.findall(r'href:\s*["\'](/[a-zA-Z0-9_\-\/]+)["\']', js)
                        found_routes += re.findall(r'#(/[a-zA-Z0-9_\-\/]+)', js)
                        routes.update(found_routes[:10])
                        
                        # Search for API endpoints
                        found_apis = re.findall(r'["\'](/api/[a-zA-Z0-9_\-\/]+)["\']', js)
                        found_apis += re.findall(r'["\'](https?://[a-zA-Z0-9_\-\.:]+/api/[a-zA-Z0-9_\-\/]+)["\']', js)
                        found_apis += re.findall(r'fetch\(["\']([^"\']+)["\']', js)
                        for ap in found_apis:
                            if any(k in ap.lower() for k in ['api', 'v1', 'v2', 'graphql', 'auth', 'data', 'orders', 'kpi', 'predict']):
                                api_endpoints.add(ap)
                        
                        # Search for common manufacturing KPI labels
                        found_kpis = re.findall(r'["\']([A-Z][A-Za-z0-9\s]{2,25}(?:OEE|Yield|Rate|Cycle|Time|Cost|Efficiency|Inventory|Defect|MTBF|MTTR|PPM|Downtime|Adherence|Score|Accuracy)[A-Za-z0-9\s]*)["\']', js)
                        kpi_mentions.update(found_kpis[:15])
                except Exception as je:
                    pass

            results[key] = {
                'name': info['name'],
                'url': info['url'],
                'base': info['base'],
                'title': title,
                'routes': list(routes)[:8],
                'api_endpoints': list(api_endpoints)[:10],
                'kpis': list(kpi_mentions)[:15],
                'script_count': len(script_srcs)
            }
    except Exception as e:
        results[key] = {
            'name': info['name'],
            'url': info['url'],
            'error': str(e)
        }

os.makedirs('docs', exist_ok=True)
with open('docs/probed_agent_data.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("Probing completed. Results saved to docs/probed_agent_data.json.")
