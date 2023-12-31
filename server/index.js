const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const initSocket = require('./socket/index');

const app = express();
const PORT = process.env.PORT || 4000;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const authMiddleware = require('./middleware/authmiddleware');

const corsOptions = {
    // Connect to Frontend
    // Fix before putting on render.com
    origin: ["http://localhost:4000", "http://localhost:5173", "https://chat-app-backend-l7nl.onrender.com"],
    allowedHeaders: ["origin", "X-Requested-With", "Content-Type", "Accept"],
    credentials: true,
    methods: ['GET', 'POST']
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/auth", authRoutes);
app.use('/users', userRoutes);

// Users
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log('DB Connection Error' + err.message));

app.post('/', authMiddleware);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// init socket w/ server & corsOptions
initSocket(server, corsOptions);
