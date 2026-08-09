const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Event = require("./models/Event");
const Booking = require("./models/Booking");

dotenv.config();

const users = [
    {
        name: "Admin User",
        email: "admin@eventbooking.com",
        password: "admin123",
        role: "admin"
    },
    {
        name: "Demo User",
        email: "user@eventbooking.com",
        password: "user123",
        role: "user"
    },
    {
        name: "Rahul Sharma",
        email: "rahul@eventbooking.com",
        password: "user123",
        role: "user"
    },
    {
        name: "Priya Das",
        email: "priya@eventbooking.com",
        password: "user123",
        role: "user"
    }
];

const events = [
    {
        title: "Tech Conference 2026",
        description:
            "A technology conference covering AI, Web Development, Cloud Computing and modern software development.",
        date: new Date("2026-09-15"),
        location: "Kolkata, India",
        category: "Technology",
        totalSeats: 200,
        ticketPrice: 500,
        image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Music Festival",
        description:
            "Enjoy live performances from talented artists with an amazing atmosphere.",
        date: new Date("2026-09-25"),
        location: "Durgapur, India",
        category: "Music",
        totalSeats: 500,
        ticketPrice: 800,
        image:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Startup Meetup",
        description:
            "Meet entrepreneurs, developers and investors and learn about building successful startups.",
        date: new Date("2026-10-05"),
        location: "Bengaluru, India",
        category: "Business",
        totalSeats: 150,
        ticketPrice: 300,
        image:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Art & Creativity Expo",
        description:
            "Explore paintings, digital art, photography and creative work from different artists.",
        date: new Date("2026-10-15"),
        location: "Kolkata, India",
        category: "Art",
        totalSeats: 250,
        ticketPrice: 200,
        image:
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Web Development Workshop",
        description:
            "A practical workshop on HTML, CSS, JavaScript, React, Node.js and MongoDB.",
        date: new Date("2026-10-25"),
        location: "Durgapur, India",
        category: "Technology",
        totalSeats: 100,
        ticketPrice: 400,
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("MongoDB connected successfully.");

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});
        await Booking.deleteMany({});

        console.log("Old data deleted.");

        // Hash passwords
        const hashedUsers = [];

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            hashedUsers.push({
                ...user,
                password: hashedPassword,
                isVerified: true
            });
        }

        // Create users
        const createdUsers = await User.insertMany(hashedUsers);

        console.log(`${createdUsers.length} users created.`);

        // Find admin
        const adminUser = createdUsers.find(
            (user) => user.role === "admin"
        );

        // Create events
        const eventsWithDetails = events.map((event) => ({
            ...event,
            availableSeats: event.totalSeats,
            createdBy: adminUser._id
        }));

        const createdEvents = await Event.insertMany(eventsWithDetails);

        console.log(`${createdEvents.length} events created.`);

        // Normal users
        const normalUsers = createdUsers.filter(
            (user) => user.role === "user"
        );

        // Create dummy bookings
        const bookings = [];

        for (let i = 0; i < Math.min(normalUsers.length, createdEvents.length); i++) {
            const user = normalUsers[i];
            const event = createdEvents[i];

            bookings.push({
                userId: user._id,
                eventId: event._id,
                status: "confirmed",
                paymentStatus:
                    event.ticketPrice > 0 ? "paid" : "not_paid",
                amount: event.ticketPrice
            });

            // Reduce available seats
            event.availableSeats -= 1;
            await event.save();
        }

        if (bookings.length > 0) {
            await Booking.insertMany(bookings);
        }

        console.log(`${bookings.length} bookings created.`);

        console.log("\n====================================");
        console.log("EVENT BOOKING DATABASE SEEDED");
        console.log("====================================");
        console.log("Admin:");
        console.log("Email: admin@eventbooking.com");
        console.log("Password: admin123");
        console.log("------------------------------------");
        console.log("User:");
        console.log("Email: user@eventbooking.com");
        console.log("Password: user123");
        console.log("====================================\n");

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");
        process.exit(0);

    } catch (error) {
        console.error("Error while seeding database:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedDatabase();

