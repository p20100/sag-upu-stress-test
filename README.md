# installation
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6


# basic
source .env && k6 run stress.js --summary-export out-summary.json

# Export métriques détaillées vers CSV via l’output CSV intégré
K6_STATSD_ENABLE_TAGS=true \
source .env && k6 run stress.js -e --summary-export out-summary.json --out csv=out-metrics.csv 