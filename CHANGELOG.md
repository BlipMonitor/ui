# Changelog

All notable changes to Blip Monitor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-01-16

### Added
- Auto-detected anomalies system replacing manual alerts
- Advanced filtering in anomalies view with severity classification
- Dynamic mock data generation for development
- Comprehensive anomalies page with detailed inspection drawer
- Active anomalies banner on overview page

### Changed
- Migrated from manual alert rules to automated anomaly detection
- Updated metrics display to show anomaly counts
- Enhanced activity feed with improved filtering
- Refactored alerts-related components to support anomalies

### Removed
- Manual alert rules configuration
- Alert thresholds settings
- Legacy alerts page and components

## [0.2.0] - 2025-01-11

### Added
- Settings pages for contracts, notifications, and profile management
- Contract management with CRUD operations
- Notifications setup for Slack and email
- Profile and account management
- Comprehensive mock data utilities
- No-data states for all pages

### Changed
- Enhanced breadcrumb implementation across all pages
- Improved contract switcher with network status
- Updated navigation structure

## [0.1.0] - 2025-01-02

### Added
- Performance page with gas usage and execution time tabs
- Top calls analysis with drill-down capability
- Activity feed with multi-function filtering
- Overview page with key metric cards
- Recent events snippet
- Mini gas usage chart
- Mobile-responsive navigation drawer
- Contract switcher with keyboard shortcuts
- Loading states with skeleton UI
- Dark mode support

### Changed
- Split performance metrics into separate tabs
- Enhanced filter bar functionality
- Improved mobile navigation experience

## [0.0.1] - 2024-12-30

### Added
- Initial project setup with Next.js 14
- Basic dashboard structure
- Sidebar navigation with active highlighting
- Dynamic breadcrumbs
- Dark-themed UI with shadcn/ui
- Basic page routing and metadata

[0.3.0]: https://github.com/BlipMonitor/ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/BlipMonitor/ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/BlipMonitor/ui/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/BlipMonitor/ui/releases/tag/v0.0.1