import { eventHandler, getRequestURL } from 'vinxi/http';
import { render } from 'svelte/server';
import App from '../App.svelte';
import appHtml from '../app.html?raw';

import { getManifest } from 'vinxi/manifest';
import { getStack } from './routes';

export default eventHandler(async (event) => {
	const url = getRequestURL(event);

	const clientManifest = getManifest('client');

	const mods = await getStack('/');

	if (!mods) return new Response();

	const { assets, components } = mods;

	const { head, body } = render(App, {
		props: {
			page: {
				url
			},

			components,
			assets: [
				{
					tag: 'script',
					attrs: {},
					children: `window.manifest = ${JSON.stringify(await clientManifest.json())}`
				},
				{
					tag: 'script',
					attrs: {
						type: 'module',
						src: clientManifest.inputs[clientManifest.handler].output.path
					}
				},
				...assets
			]
		}
	});

	const html = appHtml.replace('%head%', head).replace('%body%', body);

	const response = new Response(html, {
		headers: {
			'content-type': 'text/html'
		}
	});

	return response;
});
