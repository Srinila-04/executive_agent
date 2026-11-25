import urllib.request
import re
import json

urls = {
  'production_planning': 'https://production-planning-khaki.vercel.app',
  'oee_performance': 'https://oee-performance-agent.vercel.app',
  'predictive_maintenance': 'https://predictive-maintenance-frontend-kappa.vercel.app',
  'quality_management': 'https://quality-management-agent-app.vercel.app',
  'vision_ai_inspection': 'https://vision-ai-inspection-agent-app.vercel.app',
  'engineering_change': 'https://manufacturing-ai-frontend.vercel.app',
  'product_traceability': 'https://product-traceability-rho.vercel.app',
  'inventory_management': 'https://inventory-managment-agent.vercel.app',
  'supplier_performance': 'https://supplier-performance-agent-frontend-sable.vercel.app',
  'agentic_rfq': 'https://manufacturing-rfq-poc.vercel.app',
  'logistics_dispatch': 'https://logistics-dispatch-gamma.vercel.app',
  'energy_management': 'https://energy-gules.vercel.app',
  'ehs_safety': 'https://frontend-dhob.onrender.com',
  'workforce_management': 'https://workforce-management-navy.vercel.app',
  'manufacturing_cost': 'https://mfc-agent-frontend.vercel.app',
  'customer_order': 'https://customer-order-management-two.vercel.app',
  'digital_twin': 'https://digital-twin-frontend-c0ji.onrender.com'
}

detailed_analysis = {}

for agent_id, base_url in urls.items():
    print(f"Deep analyzing {agent_id}...")
    try:
        req = urllib.request.Request(base_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
        script_paths = re.findall(r'src=["\']([^"\']+\.js[^"\']*)["\']', html)
        all_js = ""
        for sp in script_paths:
            s_url = sp if sp.startswith('http') else base_url.rstrip('/') + '/' + sp.lstrip('/')
            try:
                s_req = urllib.request.Request(s_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(s_req, timeout=15) as s_resp:
                    all_js += s_resp.read().decode('utf-8', errors='ignore') + "\n"
            except Exception:
                pass
                
        # Look for navigation/tabs
        nav_matches = re.findall(r'["\']([A-Z][a-zA-Z\s&]{2,20})["\'],?\s*(?:icon|path|href)', all_js)
        # Look for headers/subheaders
        card_titles = re.findall(r'title:\s*["\']([^"\']{3,35})["\']', all_js)
        card_labels = re.findall(r'label:\s*["\']([^"\']{3,35})["\']', all_js)
        card_metrics = re.findall(r'metric:\s*["\']([^"\']{3,35})["\']', all_js)
        units = re.findall(r'unit:\s*["\']([^"\']{1,10})["\']', all_js)
        
        # Look for chart types
        charts_found = []
        for ctype in ['LineChart', 'BarChart', 'AreaChart', 'PieChart', 'DonutChart', 'ScatterChart', 'RadialBarChart', 'ComposedChart', 'Treemap', 'Heatmap', 'Gantt']:
            if ctype in all_js or ctype.lower() in all_js:
                charts_found.append(ctype)
                
        # Look for filters
        filter_keys = set(re.findall(r'["\'](plant|site|shift|line|date|range|status|severity|supplier|product|category|order)["\']', all_js, re.I))
        
        # Look for APIs
        apis = set(re.findall(r'["\'](/(?:api|v[0-9]|rest)/[a-zA-Z0-9_\-\/]+)["\']', all_js))
        apis.update(re.findall(r'["\'](https?://[^"\']*/(?:api|v[0-9])/[a-zA-Z0-9_\-\/]+)["\']', all_js))

        detailed_analysis[agent_id] = {
            'nav': list(set(nav_matches))[:10],
            'card_titles': list(set(card_titles + card_labels + card_metrics))[:15],
            'units': list(set(units))[:8],
            'charts': charts_found,
            'filters': list(filter_keys),
            'apis': list(apis)[:10],
            'js_size': len(all_js)
        }
    except Exception as e:
        detailed_analysis[agent_id] = {'error': str(e)}

with open('docs/deep_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(detailed_analysis, f, indent=2)

print("Deep analysis complete. Saved to docs/deep_analysis.json.")
