import { AppOptions, RouterSchemaInput, createApp, resolve } from 'vinxi';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { serverFunctions } from '@vinxi/server-functions/plugin';
import { FileSystemRouter } from './src/router';
import { FileSystemRouterConfig } from 'vinxi/fs-router';

function createRouterFactory(config: FileSystemRouterConfig) {
	return (router: RouterSchemaInput, app: AppOptions) =>
		new FileSystemRouter(
			{
				dir: resolve.absolute(config.dir, router.root!),
				extensions: config.extensions
			},
			router,
			app
		);
}

export default createApp({
	server: {
		alias: {
			$lib: 'src/lib'
		}
	},
	routers: [
		{
			name: 'public',
			type: 'static',
			dir: './public'
		},
		{
			name: 'ssr',
			type: 'http',
			handler: './src/server-entry.ts',
			target: 'server',
			routes: createRouterFactory({
				dir: 'src/routes',
				extensions: ['svelte', 'ts', 'js']
			}),
			plugins: () => [svelte()]
		},
		{
			name: 'client',
			type: 'client',
			handler: './src/client-entry.ts',
			target: 'browser',
			base: '/_build',
			routes: createRouterFactory({
				dir: 'src/routes',
				extensions: ['svelte', 'ts', 'js']
			}),
			plugins: () => [serverFunctions.client(), svelte()]
		},
		serverFunctions.router()
	]
});
