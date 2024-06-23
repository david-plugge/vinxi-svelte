import { getManifest } from 'vinxi/manifest';
import fileRoutes from 'vinxi/routes';

export const routeMap = new Map(fileRoutes.map((route) => [route.path, route]));

export async function getStack(key: string) {
	const route: any = routeMap.get(key);
	if (!route) return false;

	const layouts: string[] = route.layouts;
	const clientManifest = getManifest('client');

	const assetPromises: any[] = [];

	if (!import.meta.env.DEV) {
		assetPromises.push(
			clientManifest.inputs[clientManifest.handler].assets(),
			...layouts.map((layout) => clientManifest.inputs[route[layout].src].assets()),
			clientManifest.inputs[route.$component.src].assets()
		);
		// } else {
		// assetPromises.push(clientManifest.inputs[route.$component.src].assets());
	}

	const assets: any[] = await Promise.all(assetPromises).then((res) => res.flat());

	if (import.meta.env.DEV) {
		const manifest = import.meta.env.SSR ? getManifest('ssr') : clientManifest;

		const imports = [
			...layouts.map((layout) => manifest.inputs[route[layout].src].import()),
			manifest.inputs[route.$component.src].import()
		];

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
