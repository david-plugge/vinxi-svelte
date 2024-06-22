import 'vinxi/client';
import { updateStyles } from 'vinxi/css';
import { hydrate, unmount } from 'svelte';
import App from './App.svelte';
import { getStack } from './routes';

if (import.meta.hot) {
	// import.meta.hot.on('vite:beforeUpdate', () => {
	// 	location.reload();
	// });
}

start();

async function start() {
	const mods = await getStack('/');

	if (!mods) return;

	const { assets, components } = mods;

	if (typeof window !== 'undefined' && import.meta.hot) {
		const styles = assets.filter((asset) => asset.tag === 'style');
		import.meta.hot.on('css-update', (data) => {
			updateStyles(styles, data);
		});
	}

	const app = hydrate(App, {
		target: document.getElementById('app')!,
		props: {
			components,
			assets
		}
	});

	// @ts-ignore
	window.unmount = () => unmount(component);
}
