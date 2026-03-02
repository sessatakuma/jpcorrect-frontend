import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
