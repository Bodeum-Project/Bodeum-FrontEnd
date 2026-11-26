import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { launchSignups } from './launch-signups.mjs';

export default defineConfig({ base: './', plugins: [react(), tailwindcss(), launchSignups()] });
