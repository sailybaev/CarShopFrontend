'use client'

import { useEffect, useRef, useState } from 'react'
import type { YandexMap as YandexMapInstance } from '@/types/yandex-maps'

interface YandexMapProps {
	lat?: number
	lng?: number
	zoom?: number
	className?: string
}

type YandexMapState =
	| { status: 'loading' }
	| { status: 'success' }
	| { status: 'error'; message: string }

function getInitialState(): YandexMapState {
	if (!process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY) {
		return { status: 'error', message: 'Yandex Maps API key is missing.' }
	}
	return { status: 'loading' }
}

export default function YandexMap({
	lat = 50.0755,
	lng = 14.4378,
	zoom = 13,
	className = ''
}: YandexMapProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<YandexMapInstance | null>(null)
	const [state, setState] = useState<YandexMapState>(getInitialState)

	const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY

	useEffect(() => {
		if (!apiKey || mapRef.current) return

		const scriptId = 'yandex-maps-script'
		const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null

		function initMap() {
			const container = mapContainerRef.current
			const ymaps = window.ymaps
			if (!container || !ymaps) return

			ymaps.ready(() => {
				if (!mapContainerRef.current || mapRef.current) return

				const map = new ymaps.Map(mapContainerRef.current, {
					center: [lat, lng],
					zoom,
					controls: ['zoomControl', 'fullscreenControl']
				})

				const placemark = new ymaps.Placemark(
					[lat, lng],
					{
						hintContent: 'CarHub Prague',
						balloonContent: 'Visit our showroom in Prague.'
					},
					{
						preset: 'islands#redDotIcon'
					}
				)

				map.geoObjects.add(placemark)
				mapRef.current = map
				setState({ status: 'success' })
			})
		}

		if (existingScript) {
			initMap()
			return
		}

		const script = document.createElement('script')
		script.id = scriptId
		script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=en_US`
		script.async = true

		script.onload = () => {
			initMap()
		}

		script.onerror = () => {
			setState({ status: 'error', message: 'Failed to load Yandex Maps.' })
		}

		document.body.appendChild(script)

		return () => {
			if (mapRef.current) {
				try {
					mapRef.current.destroy()
				} catch {
					// ignore cleanup errors
				} finally {
					mapRef.current = null
				}
			}
		}
	}, [apiKey, lat, lng, zoom])

	if (state.status === 'error') {
		return (
			<div
				className={`flex items-center justify-center bg-secondary text-sm text-muted-foreground ${className}`}
				role='alert'
			>
				{state.message}
			</div>
		)
	}

	return (
		<div className='relative h-full w-full'>
			{state.status === 'loading' && (
				<div className='absolute inset-0 z-10 flex items-center justify-center bg-secondary text-sm text-muted-foreground'>
					Loading map...
				</div>
			)}
			<div
				ref={mapContainerRef}
				className={`h-full w-full ${className}`}
				aria-label='Yandex Map'
			/>
		</div>
	)
}
