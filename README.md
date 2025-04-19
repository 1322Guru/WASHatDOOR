# WASHatDOOR

A car wash appointment booking platform that connects customers with service providers.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd WASHatDOOR
```

2. Install dependencies for both server and client:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:

In one terminal (for the server):
```bash
npm start
```

In another terminal (for the client):
```bash
cd client
npm start
```

The server will run on http://localhost:5000 and the client on http://localhost:3000

## Development

- Server code is in the root directory
- Client code is in the `client` directory
- API endpoints are defined in `server/routes`
- React components are in `client/src/components`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Environment Variables

Create a `.env` file in the root directory with these variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Deployment

1. For the server:
   - Set up a MongoDB database (Atlas recommended for cloud hosting)
   - Deploy to a hosting service (Heroku, DigitalOcean, etc.)
   - Set environment variables on the hosting platform

2. For the client:
   - Build the React app: `cd client && npm run build`
   - Deploy the build folder to a static hosting service (Netlify, Vercel, etc.)
   - Update the API base URL in the client to point to your deployed server

## License

MIT 