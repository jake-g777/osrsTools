# ToolScape

A modern web application for OSRS tools and utilities.

## Features

- DPS Calculator
- Clue Tracker
- Quest Helper
- World Events Tracker
- GE Price Tracker
- Combat Level Calculator
- Skill Calculator
- Achievement Diary Tracker

## Tech Stack

### Frontend
- Next.js 15
- Tailwind CSS 3
- shadcn/ui
- TypeScript
- React Query
- Zustand

### Backend
- Fastify
- PostgreSQL
- Prisma
- TypeScript
- JWT Authentication

### Infrastructure
- Docker
- Docker Compose
- GitHub Actions
- AWS (ECS, RDS, S3)

## Getting Started

### Prerequisites

- Node.js 20
- Docker and Docker Compose
- PostgreSQL 16

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/toolscape.git
cd toolscape
```

2. Install dependencies:
```bash
# Install web dependencies
cd apps/web
npm install

# Install API dependencies
cd ../api
npm install
```

3. Set up environment variables:
```bash
# Web app
cp apps/web/.env.example apps/web/.env

# API
cp apps/api/.env.example apps/api/.env
```

4. Start the development environment:
```bash
docker-compose up
```

The application will be available at:
- Web app: http://localhost:3000
- API: http://localhost:3001
- API Documentation: http://localhost:3001/documentation

### Development Workflow

1. Start the development servers:
```bash
# Web app
cd apps/web
npm run dev

# API
cd apps/api
npm run dev
```

2. Run tests:
```bash
# Web app
cd apps/web
npm test

# API
cd apps/api
npm test
```

3. Build for production:
```bash
# Web app
cd apps/web
npm run build

# API
cd apps/api
npm run build
```

## Project Structure

```
toolscape/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   ├── lib/           # Utility functions
│   │   └── public/        # Static assets
│   │
│   └── api/                # Fastify backend
│       ├── src/
│       │   ├── config/    # Configuration
│       │   ├── routes/    # API routes
│       │   ├── services/  # Business logic
│       │   └── utils/     # Utility functions
│       └── prisma/        # Database schema
│
├── docker/                 # Docker configuration
├── .github/               # GitHub Actions workflows
└── docker-compose.yml     # Development environment
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Old School RuneScape](https://oldschool.runescape.com/) for game data
- [OSRS Wiki](https://oldschool.runescape.wiki/) for reference
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Fastify](https://www.fastify.io/) for the blazing fast API framework 