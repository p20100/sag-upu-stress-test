import http from 'k6/http';
import { Trend } from 'k6/metrics';

import addresses from './data.js';

const respTime = new Trend('resp_time_ms', true); // garde chaque valeur (for trend export)

// const host = __ENV.HOST || 'http://localhost:1407';
const host = 'http://172.17.0.2:8080';
// const host =  'http://localhost:8080';
// const host =  'http://127.0.0.1:8080';
// const host = 'https://dev.icr-api.sortandgroup.fr';

const url = `${host}/api/upu/_msearch`;

const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${__ENV.API_TOKEN || ''}`, // optionnel
  'securityToken': __ENV.API_TOKEN || '' // optionnel, selon configuration du serveur
};

// console.log('Using __ENV:', JSON.stringify(__ENV));
// console.log('Using __ENV:', JSON.stringify(__ENV.API_TOKEN));

// console.log(`Using host: ${host}`);
// console.log(`Using url: ${url}`);

// console.log('Using __ENV:', JSON.stringify(headers));


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

// console.log(`Using host: ${host}`);
// console.log(`Using addresses`, JSON.stringify(addresses));

export default function () {

  const randomIndex = Math.floor(Math.random() * addresses.length);
  const selectedAddress = addresses[randomIndex];
  const data = {
    "addresses": [selectedAddress]
  };

  console.log(`Using url: ${url}`);

  const res = http.post(url, JSON.stringify(data), { headers, timeout: '60s' });
  if (res.status !== 200) {
    console.error(`Error: ${res.status} - ${res.body} - ${res.message}`);
  }
  respTime.add(res.timings.duration);
}

