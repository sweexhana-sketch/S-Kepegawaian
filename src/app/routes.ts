import {
	type RouteConfigEntry,
	index,
	route,
} from '@react-router/dev/routes';

// Use import.meta.glob to find all page files. 
// Our build-server.mjs will patch this into a static object for production.
const pageModules = import.meta.glob('./**/page.{jsx,tsx}');

function getRoutePath(filePath: string): string {
  // filePath looks like "./pegawai/list/page.jsx" or "./page.jsx"
  const parts = filePath.split('/').filter(p => p !== '.' && p !== 'page.jsx' && p !== 'page.tsx');
  
  if (parts.length === 0) return '';
  
  return parts.map(segment => {
    // Handle [param] and [...catchall]
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const content = segment.slice(1, -1);
      if (content.startsWith('...')) {
        return '*'; // React Router catch-all
      }
      return `:${content}`;
    }
    return segment;
  }).join('/');
}

const routes: RouteConfigEntry[] = [];

// Sort paths to ensure non-parameter routes come first
const sortedPaths = Object.keys(pageModules).sort((a, b) => {
  const isParamA = a.includes('[');
  const isParamB = b.includes('[');
  if (isParamA && !isParamB) return 1;
  if (!isParamA && isParamB) return -1;
  return a.localeCompare(b);
});

for (const path of sortedPaths) {
  const routePath = getRoutePath(path);
  if (routePath === '') {
    routes.push(index(path));
  } else {
    routes.push(route(routePath, path));
  }
}

// Add the 404 handler
routes.push(route('*?', './__create/not-found.tsx'));

export default routes;
