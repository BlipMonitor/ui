# Blip Monitor UI

<div align="center">
  <h3>Real-time monitoring dashboard for Soroban smart contracts</h3>
</div>

## Overview

Blip Monitor is a developer-focused monitoring solution for Soroban smart contracts. It provides real-time visibility into contract performance, events, and health through an intuitive dashboard interface.

### Key Features

- 📊 **Real-time Event Monitoring**: Track contract events and transaction outcomes as they happen
- 📈 **Performance Metrics**: Monitor gas usage and execution time with detailed charts
- 🔍 **Auto-detected Anomalies**: Get notified of critical and high severity anomalies in your contracts
- 📱 **Developer-First UI**: Clean, dark-themed interface optimized for extended use
- ⚡ **Quick Setup**: Start monitoring with just a Contract ID

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Context + Server Components
- **Form Handling**: React Hook Form + Zod

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/BlipMonitor/ui.git
   cd ui
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
ui/
├── app/                   # Next.js app router pages
│   ├── dashboard/        # Dashboard and metrics
│   ├── activity/         # Activity feed
│   ├── performance/      # Performance metrics
│   ├── anomalies/       # Auto-detected anomalies
│   └── settings/        # User settings
├── components/           # React components
│   ├── anomalies/       # Anomaly-related components
│   ├── charts/          # Chart components
│   ├── common/          # Shared components
│   └── ui/              # shadcn/ui components
├── lib/                  # Utilities and hooks
└── styles/              # Global styles
```

## Features

### Dashboard
- Key metrics overview
- Recent events feed
- Gas usage trends
- Active anomalies banner

### Activity Feed
- Real-time event log
- Advanced filtering
- Detailed event inspection
- Success/failure tracking

### Performance
- Gas usage analysis
- Execution time metrics
- Top calls analysis
- Time range selection

### Anomalies
- Auto-detected contract anomalies
- Severity-based classification
- Detailed anomaly inspection
- Quick filtering and search

### Settings
- Contract management
- Notification preferences
- Profile settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines


- Ensure dark mode compatibility
- Maintain responsive design
- Write meaningful commit messages
- Add proper documentation for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@blip.watch or join our [Discord community](https://discord.gg/blipmonitor).
