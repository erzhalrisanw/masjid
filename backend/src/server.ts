import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  console.log(`🕌 Masjid Sayyidina Abubakar API berjalan di http://localhost:${env.port}`);
});
