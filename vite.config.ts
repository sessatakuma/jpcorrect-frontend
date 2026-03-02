import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
        port: 3000,
    },
});
