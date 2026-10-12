import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const { handleApiRequest } = require('./src/server/apiHandler.cjs');

function placementApiPlugin(): Plugin {
  return {
    name: 'placement-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            // Delete require cache so edits to server files are dynamically picked up
            const apiHandlerPath = path.resolve('./src/server/apiHandler.cjs');
            delete require.cache[apiHandlerPath];
            delete require.cache[path.resolve('./src/server/db.cjs')];
            delete require.cache[path.resolve('./src/server/groq.cjs')];
            delete require.cache[path.resolve('./src/server/pdfParser.cjs')];
            
            const { handleApiRequest } = require('./src/server/apiHandler.cjs');
            const handled = await handleApiRequest(req, res);
            if (!handled) next();
          } catch (err: any) {
            console.error('[Vite API Plugin Error]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), placementApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
