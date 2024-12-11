const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/complaintsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Complaint Schema
const complaintSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    busNumber: String,
    complaintType: String,
    complaintDescription: String,
    complaintPhoto: String,
    status: { type: String, default: 'Pending' },
    submittedAt: { type: Date, default: Date.now }
});
const Complaint = mongoose.model('Complaint', complaintSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Submit Complaint
app.post('/submit-complaint', upload.single('complaintPhoto'), async (req, res) => {
    try {
        const { name, email, mobile, busNumber, complaintType, complaintDescription } = req.body;
        const complaintPhoto = req.file ? req.file.path : null;

        const newComplaint = new Complaint({ 
            name, email, mobile, busNumber, complaintType, complaintDescription, complaintPhoto 
        });
        const savedComplaint = await newComplaint.save();
        res.json({ message: 'Complaint submitted successfully', complaintId: savedComplaint._id });
    } catch (err) {
        console.error("Error submitting complaint:", err);
        res.status(500).json({ message: 'Error submitting complaint' });
    }
});

// Check Complaint Status
app.get('/complaint-status', async (req, res) => {
    const query = req.query.query;
    try {
        const foundComplaint = await Complaint.findOne({
            $or: [{ mobile: query }, { email: query }]
        });
        res.json({ status: foundComplaint ? foundComplaint.status : null });
    } catch (err) {
        console.error("Error fetching complaint status:", err);
        res.status(500).json({ message: 'Error fetching complaint status' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
