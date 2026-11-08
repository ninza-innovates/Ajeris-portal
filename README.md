# Ajeris Admin Portal

A modern, production-ready admin portal for the Ajeris Medical Platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication System** - Secure login with session management
- 📊 **Dashboard** - Real-time statistics and activity monitoring
- 👥 **User Management** - Comprehensive user administration with security tracking
- 📄 **Studies Management** - Medical study tracking with billing and compliance
- 🏢 **Organization Management** - Multi-tenant organization support
- 📈 **Reports & Analytics** - Detailed reporting capabilities
- 🔍 **Advanced Search** - Global search with filtering
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ♿ **Accessibility** - WCAG compliant with keyboard navigation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ninza-innovates/Ajeris-portal.git
cd Ajeris-portal
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Credentials

- Email: `admin@ajeris.com`
- Password: `admin123`

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   └── (admin)/           # Admin pages (protected)
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── admin/            # Admin-specific components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── stores/               # Zustand stores
└── types/                # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Prototypes

The `public/` directory contains HTML prototypes:
- `/prototypes.html` - Index of all prototypes
- `/admin-studies-prototype.html` - Studies management prototype
- `/admin-users-prototype.html` - User management prototype

## Features in Development

- [ ] Real API integration
- [ ] WebSocket support for real-time updates
- [ ] Dark mode support
- [ ] Export functionality
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Audit logging
- [ ] Two-factor authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software owned by Ajeris Medical Platform.

## Support

For support, email support@ajeris.com or create an issue in the repository.