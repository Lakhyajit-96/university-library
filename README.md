# LearnWise

A modern learning management platform for educational institutions, built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **Caching**: Upstash Redis
- **File Storage**: ImageKit
- **Email**: Resend
- **Deployment**: Vercel

## ✨ Features

- **User Authentication**: Secure sign-up and sign-in with email verification
- **Book Management**: Add, edit, and manage library books
- **Borrowing System**: Track book loans with automated reminders
- **Admin Dashboard**: Complete administrative interface
- **User Management**: Role-based access control
- **Search & Filtering**: Advanced book discovery
- **Responsive Design**: Mobile-first approach

## 🛠️ Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd learnwise
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the `.env.local` file with your actual values:
   - Database connection string
   - ImageKit credentials
   - Upstash Redis credentials
   - Resend API token
   - Auth secret

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run seed
   ```

5. **Start Development Server**
```bash
npm run dev
```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL` - Your PostgreSQL connection string
- `AUTH_SECRET` - Random secret for NextAuth
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint
- `UPSTASH_REDIS_URL` - Upstash Redis URL
- `UPSTASH_REDIS_TOKEN` - Upstash Redis token
- `QSTASH_URL` - Upstash QStash URL
- `QSTASH_TOKEN` - Upstash QStash token
- `RESEND_TOKEN` - Resend API token

## 📁 Project Structure

```
learnwise/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Main application pages
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── components/             # Reusable components
│   ├── admin/              # Admin-specific components
│   └── ui/                 # UI components
├── database/               # Database configuration
├── lib/                    # Utility functions
└── public/                 # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.
