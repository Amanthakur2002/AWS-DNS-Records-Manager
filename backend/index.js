import 'dotenv/config';
import express from "express";
import cors from "cors";
import dnsRoutes from "./Routes/dnsRoutes.js"
import domainRoutes from "./Routes/domainRoutes.js"

const app = express();

app.use(cors(
    {
        origin: ["*"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));

// Enable CORS for all requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://aws-dns-records-manager-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/dns", dnsRoutes);
app.use("/api/domain", domainRoutes)

// configureAWS();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
