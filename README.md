# installation
sudo snap install k6

# basic
source .env && k6 run stress.js --summary-export out-summary.json

# Export métriques détaillées vers CSV via l’output CSV intégré
K6_STATSD_ENABLE_TAGS=true \
source .env && k6 run stress.js -e --summary-export out-summary.json --out csv=out-metrics.csv 