import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { google } from "googleapis";
import "./passport";
dotenv.config();
const frontend_url = "http://localhost:5173";
const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: ["http://localhost:5173", frontend_url],
    credentials: true,
  })
);
app.use(cookieParser());

//===> Routes

// Route to initiate Google login
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
  })
);

// Callback route where Google redirects users after login
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user as any; // Adjust typing according to your user model
    console.log("user", user);
    const accessToken = user.accessToken;
    const refreshToken = user.refreshTokenl;
    // Set access token as a cookie (HTTPOnly for security)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // Successful authentication
    res.redirect(frontend_url + "/playground");
  }
);

//Route to logout user
app.get("/logout", (req, res) => {
  console.log("logging out user");
  req.logout((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    res.clearCookie("accessToken");
    res.status(200).json({ message: "user logged out successfully" });
  });
});

//Route to check weather the user is loggedin or not
app.get("/isLoggedIn", (req: any, res: any) => {
  const user = req.user as any;
  if (user) {
    return res.status(200).json({
      isLoggedIn: true,
      name: user._json.name,
      email: user._json.email,
      image: user._json.picture,
    });
  }
  res.status(200).json({ isLoggedIn: false });
});

// Middleware to check if the user is authenticated
function isLoggedIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

// Initialize Google Calendar API client
function getGoogleCalendarClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth: oauth2Client });
}

//Route get events
app.get("/events:date", isLoggedIn, async (req, res) => {
  const user = req.user as any;
  const accessToken = user.accessToken;
  const { date } = req.params; // Expected format: "YYYY-MM-DD"
  console.log(date);
  // Convert the date parameter to a time range covering the entire day
  const startOfDay = new Date(`${date}T00:00:00Z`);
  const endOfDay = new Date(`${date}T23:59:59Z`);

  const calendar = getGoogleCalendarClient(accessToken);

  try {
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    res.status(200).json(events.data.items);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

//Route to insert an event
app.post("/create-event", isLoggedIn, async (req, res) => {
  const user = req.user as any;
  const accessToken = user.accessToken;

  const calendar = getGoogleCalendarClient(accessToken);
  const { name, description, startTime, endTime } = req.body;
  const event = {
    summary: name,
    location: "",
    description,
    start: {
      dateTime: startTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime,
      timeZone: "Asia/Kolkata",
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
