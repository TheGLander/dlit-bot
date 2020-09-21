import Enmap from "enmap"
const enmaps: Map<string, Enmap> = new Map()

export default async function getEnmap<T>(
	name: string
): Promise<Enmap<string, T>> {
	if (!enmaps.has(name)) enmaps.set(name, new Enmap({ name }))
	const enmap = enmaps.get(name)
	await enmap.defer
	return enmap as Enmap<string, T>
}
