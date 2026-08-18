import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    lib: {entry: {index: 'src/index.ts', styles: 'src/styles.css'}, formats: ['es'], fileName: 'index', cssFileName: 'styles'},
    rollupOptions: {external: ['ag-grid-community', 'ag-grid-react', 'react', 'react-dom', 'react/jsx-runtime']},
  },
});
