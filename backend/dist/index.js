"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const googleapis_1 = require("googleapis");
require("./passport");
dotenv_1.default.config();
const frontend_url = "http://localhost:5173";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", frontend_url],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
//===> Routes
// Route to initiate Google login
app.get("/auth/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
}));
// Callback route where Google redirects users after login
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    const user = req.user; // Adjust typing according to your user model
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
});
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
app.get("/isLoggedIn", (req, res) => {
    const user = req.user;
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
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/auth/google");
}
// Initialize Google Calendar API client
function getGoogleCalendarClient(accessToken) {
    const oauth2Client = new googleapis_1.google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return googleapis_1.google.calendar({ version: "v3", auth: oauth2Client });
}
//Route get events
app.get("/events:date", isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const accessToken = user.accessToken;
    const { date } = req.params; // Expected format: "YYYY-MM-DD"
    console.log(date);
    // Convert the date parameter to a time range covering the entire day
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);
    const calendar = getGoogleCalendarClient(accessToken);
    try {
        const events = yield calendar.events.list({
            calendarId: "primary",
            timeMin: startOfDay.toISOString(),
            timeMax: endOfDay.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });
        res.status(200).json(events.data.items);
    }
    catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
}));
//Route to insert an event
app.post("/create-event", isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
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
        const response = yield calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
}));
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
