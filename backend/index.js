import 'dotenv/config';
import express from "express";
import cors from "cors";
import dnsRoutes from "./Routes/dnsRoutes.js"
import domainRoutes from "./Routes/domainRoutes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

app.use("/api/dns", dnsRoutes);
app.use("/api/domain", domainRoutes)

// configureAWS();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
