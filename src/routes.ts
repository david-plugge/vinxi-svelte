import { updateStyles } from 'vinxi/css';
import { getManifest } from 'vinxi/manifest';
import fileRoutes from 'vinxi/routes';

export const routeMap = new Map(fileRoutes.map((route) => [route.path, route]));

export async function getStack(key: string) {
	const route: any = routeMap.get(key);
	if (!route) return false;

	const layouts: string[] = route.layouts;
	const clientManifest = getManifest('client');

	const assets: any[] = await Promise.all([
		clientManifest.inputs[clientManifest.handler].assets(),
		...layouts.map((layout) => clientManifest.inputs[route[layout].src].assets()),
		clientManifest.inputs[route.$component.src].assets()
	]).then((res) => res.flat());

	if (import.meta.env.DEV) {
		const manifest = import.meta.env.SSR ? getManifest('ssr') : clientManifest;

		const imports = [
			...layouts.map((layout) => manifest.inputs[route[layout].src].import()),
			manifest.inputs[route.$component.src].import()
		];

		console.log(assets);

		// const styles = assets.filter((asset) => asset.tag === 'style');

		// if (typeof window !== 'undefined' && import.meta.hot) {
		// 	import.meta.hot.on('css-update', (data) => {
		// 		updateStyles(styles, data);
		// 	});
		// }

		return {
			assets,
			components: await Promise.all(imports).then((res) => res.map((mod) => mod.default))
		};
	}

	const imports = [...layouts.map((layout) => route[layout].import()), route.$component.import()];

	return {
		assets,
		components: await Promise.all(imports).then((res) => res.map((mod) => mod.default))
	};
}
