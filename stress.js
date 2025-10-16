import http from 'k6/http';
import { Trend } from 'k6/metrics';

const respTime = new Trend('resp_time_ms', true); // garde chaque valeur (for trend export)

export const options = {
  discardResponseBodies: true,
  thresholds: {
    http_req_failed: ['rate<0.01'],        // <1% d'erreurs
    http_req_duration: ['p(95)<500'],      // 95% < 500 ms (exemple SLO)
  },
  scenarios: {
    step_rps: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 100, // ajuster si latence élevée (voir note ci-dessous)
      maxVUs: 2000,
      stages: [
        { target: 10, duration: '2m' },  // 10 rps
        { target: 10, duration: '3m' },  // palier
        { target: 50, duration: '2m' },  // montée
        { target: 50, duration: '3m' },  // palier
        { target: 200, duration: '2m' }, // montée
        { target: 200, duration: '5m' }, // palier
      ],
    },
  },
};

export default function () {

  const url = __ENV.TARGET_URL || 'https://dev.icr-api.sortandgroup.fr/api/upu/_msearch';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${__ENV.API_TOKEN || ''}`, // optionnel
  };

  const data = {
    "addresses": [
      {
          "reference": "xxx",
          "address": "289 RUE DU POSTES",
          "postalCode": "69000",
          "locality": "Lyon",
          "country": "france"
      }
    ]
  };


  const res = http.post(url, { headers, timeout: '60s', data });
  respTime.add(res.timings.duration);
}
