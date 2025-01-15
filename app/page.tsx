import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
	const currentYear = new Date().getFullYear();

	return (
		<div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
			<main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
				<h1 className='text-4xl font-bold mb-4'>Blip Monitor</h1>
				<p className='text-lg text-muted-foreground mb-6 max-w-[600px] text-center sm:text-left'>
					Real-time monitoring and anomaly detection for your Soroban
					smart contracts. Track performance, analyze activity, and
					get instant alerts.
				</p>

				<div className='flex gap-4 items-center flex-col sm:flex-row'>
					<Link
						className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8'
						href='/dashboard'
					>
						Open Dashboard
					</Link>
					<a
						className='rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44'
						href='https://stellar.org/soroban'
						target='_blank'
						rel='noopener noreferrer'
					>
						Learn about Soroban
					</a>
				</div>

				<div className='mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[900px]'>
					<div className='p-6 rounded-lg border border-border'>
						<h3 className='font-semibold mb-2'>
							Performance Monitoring
						</h3>
						<p className='text-sm text-muted-foreground'>
							Track gas usage, execution time, and other key
							metrics in real-time.
						</p>
					</div>
					<div className='p-6 rounded-lg border border-border'>
						<h3 className='font-semibold mb-2'>
							Activity Tracking
						</h3>
						<p className='text-sm text-muted-foreground'>
							Monitor contract interactions, function calls, and
							transaction outcomes.
						</p>
					</div>
					<div className='p-6 rounded-lg border border-border'>
						<h3 className='font-semibold mb-2'>
							Anomaly Detection
						</h3>
						<p className='text-sm text-muted-foreground'>
							Get instant alerts when unusual patterns or
							potential issues are detected.
						</p>
					</div>
				</div>
			</main>
			<footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-muted-foreground'>
				<span>© {currentYear} Blip Monitor</span>
				<span>•</span>
				<a
					className='hover:underline hover:underline-offset-4 flex items-center gap-2'
					href='https://stellar.org/soroban'
					target='_blank'
					rel='noopener noreferrer'
				>
					Built for
					<Image
						src='/images/soroban-white.svg'
						alt='Soroban Logo'
						width={80}
						height={14}
						className='invert dark:invert-0'
					/>
				</a>
				<span>•</span>
				<a
					className='hover:underline hover:underline-offset-4 flex items-center gap-2'
					href='https://stellar.org'
					target='_blank'
					rel='noopener noreferrer'
				>
					Built on
					<Image
						src='/images/stellar-white.svg'
						alt='Stellar Logo'
						width={60}
						height={20}
						className='invert dark:invert-0'
					/>
				</a>
			</footer>
		</div>
	);
}
