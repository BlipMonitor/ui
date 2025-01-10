'use client';

import { scan } from 'react-scan';

// Only enable React Scan when explicitly running in scan mode
if (
	typeof window !== 'undefined' &&
	process.env.NODE_ENV === 'development' &&
	process.env.NEXT_PUBLIC_ENABLE_SCAN === 'true'
) {
	scan({
		enabled: true,
		log: true,
		report: true,
		trackUnnecessaryRenders: true,
		renderCountThreshold: 3,
		showToolbar: true,
		alwaysShowLabels: true,
	});
}
