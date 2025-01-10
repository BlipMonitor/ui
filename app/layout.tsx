import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import '@/lib/react-scan';
import './globals.css';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'Blip Monitor',
	description: 'Real-time monitoring dashboard for Soroban smart contracts',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const isScanMode = process.env.NEXT_PUBLIC_ENABLE_SCAN === 'true';

	return (
		<html lang='en'>
			<head>
				{isScanMode && (
					<script
						src='https://unpkg.com/react-scan/dist/auto.global.js'
						async
					/>
				)}
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Analytics />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
