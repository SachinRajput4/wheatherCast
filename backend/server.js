import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";


//import  Routes
import user2Router from "./routes/user2Route.js";
import user1Router from "./routes/user1Route.js";
import CollectionRouter from "./routes/collectionRoute.js";
import inviteStudentRouter from "./routes/inviteStudentLinkRoute.js";
import viewAttendanceHistoryRouter from "./routes/viewAttendanceHistoryRoute.js";
import awsSearchRouter from "./routes/awsSearchRoute.js";
import collectionItemControllerRouter from "./routes/collectionItemRoute.js" 
import analyticsRouter from "./routes/analyticsRoute.js"


// Import weather routes
import weatherRouter from "./AuraCastRoutes/weatherRoutes.js";
import locationRouter from "./AuraCastRoutes/autocompleteRoutes.js";


dotenv.config();


// Express app setup
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);



// Allow frontend domain only
app.use(cors());


// Middleware
app.use(express.json());

// DB connection
connectDB();

// Routes
app.use("/api/user2",user2Router);
app.use("/api/user1",user1Router);
app.use("/api/collection", CollectionRouter); 
app.use('/api/invite', inviteStudentRouter);
app.use('/api/view-attendance-history', viewAttendanceHistoryRouter);
app.use('/api/aws-search', awsSearchRouter);
app.use('/api/collection-item', collectionItemControllerRouter);
app.use('/api/analytics', analyticsRouter);

// Use weather routes
app.use('/api/weather', weatherRouter);
app.use('/api/locations', locationRouter);


// Root route
app.get("/", (req, res) => {
  res.send("API Working");
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});
