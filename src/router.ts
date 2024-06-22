import { BaseFileSystemRouter, cleanPath } from 'vinxi/fs-router';
import fs from 'fs';
import path from 'path';

export class FileSystemRouter extends BaseFileSystemRouter {
	toPath(src: string) {
		const routePath = cleanPath(src, this.config).replace(/\/\+(page)$/, '');

		return routePath?.length > 0 ? routePath : '/';
	}

	isRoute(src: any): boolean {
		if (typeof src === 'string') {
			const { name } = path.parse(src);

			if (name === '+page') return true;
		}

		return false;
	}

	toRoute(filePath: string) {
		const _path = this.toPath(filePath);
		const segments = path.dirname(_path).split('/').slice(1);

		const layouts: string[] = [];
		const layoutsObj: Record<
			string,
			{
				src: string;
				pick: string[];
			}
		> = {};

		for (const segment of segments) {
			const layoutSrc = path.resolve(this.config.dir, segment, '+layout.svelte');
			const exists = fs.existsSync(layoutSrc) === true;

			if (exists) {
				const layoutName = '$layout' + layouts.length;
				layouts.push(layoutName);
				layoutsObj[layoutName] = {
					src: layoutSrc,
					pick: ['default']
				};
			}
		}

		return {
			path: _path,
			$component: {
				src: filePath,
				pick: ['default']
			},
			layouts,
			...layoutsObj
		};
	}
}
