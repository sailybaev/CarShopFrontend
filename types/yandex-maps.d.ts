export interface YandexMapGeometry {
	getMap(): YandexMap | null
}

export interface YandexPlacemark {
	geometry: YandexMapGeometry
}

export interface YandexGeoObjectCollection {
	add(object: YandexPlacemark): YandexGeoObjectCollection
}

export interface YandexMap {
	geoObjects: YandexGeoObjectCollection
	destroy(): void
}

export interface YandexMapOptions {
	center: [number, number]
	zoom: number
	controls?: string[]
}

export interface YandexPlacemarkProperties {
	hintContent?: string
	balloonContent?: string
}

export interface YandexPlacemarkOptions {
	preset?: string
}

export interface YandexMapsAPI {
	ready(callback: () => void): void
	Map: new (container: HTMLElement, options: YandexMapOptions) => YandexMap
	Placemark: new (
		geometry: [number, number],
		properties: YandexPlacemarkProperties,
		options: YandexPlacemarkOptions
	) => YandexPlacemark
}

declare global {
	interface Window {
		ymaps?: YandexMapsAPI
	}
}

export {}
