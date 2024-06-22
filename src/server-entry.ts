import { eventHandler } from 'vinxi/http';
import { render } from 'svelte/server';
import App from './App.svelte';
import appHtml from './app.html?raw';

import { getManifest } from 'vinxi/manifest';
import { getStack } from './routes';

export default eventHandler(async (event) => {
	const clientManifest = getManifest('client');

	const mods = await getStack('/');

	if (!mods) return new Response();

	const { assets, components } = mods;

	const { head, body } = render(App, {
		props: {
			components,
			assets
		}
	});

	const bootstrap =
		`<script>window.manifest = ${JSON.stringify(await clientManifest.json())}</script> \n` +
		`<script src="${clientManifest.inputs[clientManifest.handler].output.path}" type="module"></script>`;

	const html = appHtml.replace('%head%', head + bootstrap).replace('%body%', body);

	const response = new Response(html, {
		headers: {
			'content-type': 'text/html'
		}
	});

	return response;
});
