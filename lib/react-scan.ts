'use client';

import { scan } from 'react-scan';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
	scan({
		enabled: true,
		log: true,
		report: true, // Enable report generation
		trackUnnecessaryRenders: true,
		renderCountThreshold: 3,
		showToolbar: true,
		alwaysShowLabels: true,
	});
}
