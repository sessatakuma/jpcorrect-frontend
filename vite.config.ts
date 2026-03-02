import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'src/components'),
            utilities: path.resolve(__dirname, 'src/utilities'),
            data: path.resolve(__dirname, 'src/data'),
            hook: path.resolve(__dirname, 'src/hook'),
        },
    },
    server: {
        open: true,
        port: 3000,
    },
});
