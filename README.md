<<<<<<< HEAD
# SportsEquipHub
Sports Instrument Management System - A comprehensive platform for managing college sports equipment inventory. Features role-based access (admin/user), real-time instrument tracking, request management, CSV import capability, AI chatbot support, and comprehensive admin controls for inventory and user management.
=======
# SportGear Pro - Sports Instrument Management System

A professional, feature-rich sports equipment inventory management system built with Next.js, MongoDB, and TypeScript. Designed for sports facilities, schools, clubs, and organizations to efficiently track, manage, and optimize their sports equipment.

## 🎯 Features

### Core Features
- **Real-Time Inventory Tracking** - Monitor sports equipment availability instantly
- **Dual-Role Authentication** - Separate Admin and User dashboards with role-based access control
- **Equipment Request System** - Users can request instruments with status tracking
- **Admin Query Management** - Administrators can respond to user questions and issues
- **Interactive Chatbot** - 15+ FAQ questions with custom query submission capability
- **Bulk Import** - Import students and instruments via CSV files
- **Complete Audit History** - Track equipment usage and status changes
- **Advanced Search** - Search users by email and equipment by sports name
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark Mode Support** - Full dark mode implementation

### Admin Features
- Dashboard with analytics and statistics
- User and Admin management (create, edit, deactivate)
- Equipment inventory management (add, edit, disable items)
- Request management with approval/decline functionality
- Instrument history tracking (view all requests for each item)
- CSV import for bulk user and equipment registration
- Query response system for user support
- Real-time status updates and notifications

### User Features
- Personal dashboard with quick statistics
- Browse and request available equipment
- Track submitted instruments and their status
- View booking history and equipment requests
- Submit custom queries to administrators
- View responses from administrators
- Real-time availability tracking

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Shadcn/UI components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with secure password hashing (bcrypt)
- **UI Components**: Radix UI, Lucide Icons
- **Forms**: React Hook Form, Zod validation
- **Analytics**: Vercel Analytics
- **Charts**: Recharts

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or cloud - MongoDB Atlas)
- A code editor (VS Code recommended)

## 🚀 Getting Started

### 1. Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd sports-instrument-management

# Install dependencies
npm install
# or
yarn install
\`\`\`

### 2. Environment Variables

Create a `.env.local` file in the project root with the following variables:

\`\`\`env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/sports-instrument-db
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sports-instrument-db?retryWrites=true&w=majority

# JWT Secret for session management (generate a random string)
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
\`\`\`

### 3. MongoDB Setup

**Option A: Local MongoDB**
\`\`\`bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
\`\`\`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

### 4. Running the Application

\`\`\`bash
# Development mode
npm run dev
# or
yarn dev

\`\`\`

### 5. Building for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── import/             # Bulk import endpoints
│   │   ├── items/              # Equipment management
│   │   ├── requests/           # Request management
│   │   └── user-queries/       # Query management
│   ├── dashboard/
│   │   ├── admin/              # Admin pages
│   │   └── user/               # User pages
│   ├── login/                  # Login pages
│   ├── register/               # Registration pages
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── chatbot.tsx             # AI chatbot component
│   ├── ui/                     # Shadcn UI components
│   └── [feature-modals].tsx    # Feature-specific modals
├── models/
│   ├── User.ts                 # User schema
│   ├── Item.ts                 # Equipment schema
│   ├── Request.ts              # Request schema
│   └── UserQuery.ts            # Query schema
├── lib/
│   ├── mongoose.ts             # MongoDB connection
│   ├── auth.ts                 # Authentication utilities
│   └── utils.ts                # Helper functions
├── middleware.ts               # Next.js middleware
└── package.json                # Dependencies
\`\`\`

## 🔐 Authentication Flow

### User Registration
1. User navigates to `/register/user` or `/register/admin`
2. Fills in email, password, name, and role
3. Password is hashed using bcrypt (10 salt rounds)
4. User account is created in MongoDB
5. Automatic redirect to login page

### User Login
1. User enters email and password
2. System verifies credentials against MongoDB
3. JWT token is generated and stored in httpOnly cookie
4. User is redirected to their respective dashboard
5. Session verified on every page load

### Session Management
- Tokens are verified via `/api/auth/verify` endpoint
- Failed verification returns 401 Unauthorized
- Expired or invalid sessions redirect to login
- Admins cannot access user routes and vice versa

## 📊 Database Schema

### User Collection
\`\`\`typescript
{
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  name: String,
  role: "admin" | "user",
  isActive: Boolean,
  createdAt: Date
}
\`\`\`

### Item Collection
\`\`\`typescript
{
  itemName: String,
  itemQuantity: Number,
  sportsName: String,
  itemCode: String (unique),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Request Collection
\`\`\`typescript
{
  userId: ObjectId (User reference),
  itemId: ObjectId (Item reference),
  status: "pending" | "approved" | "issued" | "submitted" | "declined",
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### UserQuery Collection
\`\`\`typescript
{
  userId: ObjectId (User reference),
  query: String,
  response: String,
  status: "pending" | "resolved",
  createdAt: Date,
  resolvedAt: Date
}
\`\`\`

## 🎮 How to Use

### For Admins

1. **Login**: Go to `/login/admin` and enter credentials
2. **Dashboard**: View statistics and quick actions
3. **Manage Users**: Add, edit, or deactivate users
4. **Manage Equipment**: Add items, track inventory, disable damaged items
5. **View Requests**: Approve or decline equipment requests
6. **Track History**: View complete history of each item
7. **Respond to Queries**: Answer user questions via query management
8. **Import Data**: Bulk import students and equipment via CSV

### For Users

1. **Login**: Go to `/login/user` and enter credentials
2. **Dashboard**: View personal statistics and available equipment
3. **Request Equipment**: Browse and request sports instruments
4. **Track Requests**: Monitor status of submitted requests
5. **View History**: Check booking history
6. **Ask Questions**: Use chatbot or submit custom queries
7. **Get Support**: View admin responses to your queries

### CSV Import Format

**Students Import (students.csv)**
\`\`\`
name,email,password,role
John Doe,john@example.com,password123,user
Jane Admin,admin@example.com,password123,admin
\`\`\`

**Equipment Import (equipment.csv)**
\`\`\`
itemName,itemQuantity,sportsName,itemCode
Basketball,10,Basketball,BALL-001
Soccer Ball,15,Soccer,BALL-002
Tennis Racket,20,Tennis,RACKET-001
\`\`\`

## 🤖 Chatbot Feature

The system includes an interactive chatbot with:
- **15+ FAQ Questions** covering system features and functionality
- **Custom Query Input** for user-specific questions
- **Quick Access Button** visible on all pages
- **Real-time Response** with admin feedback system

## 🔍 Search Features

### Admin Dashboard Search
- **Search Users**: Find users by email address
- **Search Equipment**: Find equipment by sports name
- Real-time filtering and instant results

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User/Admin registration
- `POST /api/auth/login` - User/Admin login
- `GET /api/auth/verify` - Verify session
- `POST /api/auth/logout` - User logout

### Items/Equipment
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item
- `POST /api/items/toggle-active/[id]` - Toggle item active status
- `GET /api/items/[id]/history` - Get item history

### Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `PUT /api/requests/[id]` - Update request status
- `DELETE /api/requests/[id]` - Delete request

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user
- `POST /api/users/toggle-active` - Toggle user active status

### Imports
- `POST /api/import/students` - Import students from CSV
- `POST /api/import/instruments` - Import equipment from CSV

### Queries
- `GET /api/user-queries` - Get user queries
- `POST /api/user-queries` - Submit new query
- `PUT /api/user-queries/[id]` - Update query response

## 🛡 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based sessions
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Role-Based Access Control**: Admin/User separation
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built into Next.js
- **Secure Headers**: Content Security Policy

## 🎨 Customization

### Changing Colors
Edit `/app/globals.css` and modify the color variables:
\`\`\`css
--primary: oklch(0.45 0.25 280);    /* Purple */
--accent: oklch(0.55 0.22 15);      /* Orange */
\`\`\`

### Adding New Features
1. Create model in `/models/`
2. Add API routes in `/app/api/`
3. Create UI components in `/components/`
4. Add pages in `/app/dashboard/`

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- Verify database permissions

### Session Lost on Back Button
- Clear browser cache
- Check JWT secret is set correctly
- Verify cookies are enabled

### CSV Import Failing
- Ensure CSV format matches requirements
- Check for empty rows or extra spaces
- Verify column headers are exact

### Counts Not Displaying
- Check MongoDB connection
- Verify user permissions
- Clear browser localStorage

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## 🎯 Future Enhancements

- Email notifications for requests
- Mobile app version
- Advanced analytics and reporting
- Equipment maintenance scheduling
- Barcode/QR code scanning
- Multi-facility support
- Integration with calendar systems
- Equipment condition tracking
- Damage reporting system

## 📞 Contact

**SportGear Pro Team**
- Email: support@sportgearpro.com
- Website: https://sportgearpro.com

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Maintained By**: SportGear Pro Development Team
>>>>>>> fb9deb9 (initial commit)
