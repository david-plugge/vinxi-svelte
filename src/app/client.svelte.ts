import 'vinxi/client';
import { hydrate, unmount, type ComponentProps } from 'svelte';
import App from '../App.svelte';
import { getStack } from './routes';
import type { Page } from '$lib/page';
import { URL } from 'svelte/reactivity';

if (import.meta.hot) {
	// import.meta.hot.on('vite:beforeUpdate', () => {
	// 	location.reload();
	// });
}

start();

async function start() {
	const initialUrl = new URL(location.href);

	const mods = await getStack(initialUrl.pathname);

	if (!mods) return;

	const page: Page = $state({
		url: new URL(location.href),
		state: {}
	});

	let appProps: ComponentProps<typeof App> = $state({
		components: mods.components,
		assets: mods.assets,
		page
	});

	const app = hydrate(App, {
		target: document.getElementById('app')!,
		props: appProps
	});

	addEventListener('click', (e) => {
		const { target } = e;
		if (e.defaultPrevented) return;

		if (target instanceof HTMLAnchorElement) {
			const targetUrl = new URL(target.href);
			if (targetUrl.origin !== location.origin) return;
			if (e.shiftKey || e.ctrlKey) return;

			e.preventDefault();

			goto(targetUrl);
		}
	});

	addEventListener('popstate', (e) => {
		e.state;
		page.url.href = location.href;
	});
	addEventListener('hashchange', (e) => {
		page.url.hash = new URL(e.newURL).hash;
	});

	// @ts-ignore
	window.unmount = () => unmount(app);

	async function goto(
		target: string | URL,
		options?: {
			state?: Record<string, any>;
		}
	) {
		const url = new URL(target);

		const mod = await getStack(url.pathname);

		if (!mod) {
			console.error('404!');
			return;
		}

		appProps.components = mod.components;
		appProps.assets = mod.assets;

		const state = options?.state ?? {};
		history.pushState(state, '', url);
		page.url.href = url.href;
		page.state = state;
	}
}
