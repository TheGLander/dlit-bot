import Enmap from "enmap"
const enmaps: Map<string, Enmap> = new Map()

export default async function getEnmap(name: string): Promise<Enmap> {
	if (!enmaps.has(name)) enmaps.set(name, new Enmap({ name }))
	const enmap = enmaps.get(name)
	await enmap.defer
	return enmap
}
