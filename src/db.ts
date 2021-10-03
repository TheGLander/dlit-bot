import Enmap from "enmap"
const enmaps: Map<string, Enmap> = new Map()

export default async function getEnmap<T>(
	name: string
): Promise<Enmap<string, T>> {
	let enmap = enmaps.get(name)
	if (!enmap) {
		enmap = new Enmap({ name })
		enmaps.set(name, enmap)
	}
	await enmap.defer
	return enmap as Enmap<string, T>
}
