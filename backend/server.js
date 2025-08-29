// Add process error handlers first
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('🚀 Starting Gmail News Server...');

// Import required modules
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

console.log('✅ Modules imported successfully');
console.log('📍 Current directory:', __dirname);
console.log('📍 Process CWD:', process.cwd());

const app = express();

// CORS configuration for localhost:5173
app.use(cors({
    // origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    origin: ['*'],
    credentials: true
}));

app.use(express.json());

// Import your newsChecker function - with error handling
let newsChecker;
try {
    const aiSetup = require('./src/controllers/AISetup.js');
    newsChecker = aiSetup.newsChecker;
    console.log('✅ newsChecker imported successfully');
} catch (error) {
    console.error('❌ Error importing newsChecker:', error.message);
    console.error('📍 Make sure AISetup.js exists at: ./src/controllers/AISetup.js');
    // Create a fallback function
    newsChecker = async (text, imagePath) => {
        console.log('⚠️ Using fallback newsChecker');
        return `Fallback response for: ${text ? text.substring(0, 100) : 'No text'}...`;
    };
}

class GmailNewsPoller {
    constructor() {
        console.log('🔧 Initializing GmailNewsPoller...');
        
        // Check environment variables
        this.clientId = process.env.CLIENT_ID;
        this.clientSecret = process.env.CLIENT_SECRET;
        this.refreshToken = process.env.REFRESH_TOKEN;
        
        if (!this.clientId || !this.clientSecret || !this.refreshToken) {
            console.error('❌ Missing required environment variables:');
            console.error('CLIENT_ID:', this.clientId ? '✅' : '❌');
            console.error('CLIENT_SECRET:', this.clientSecret ? '✅' : '❌');
            console.error('REFRESH_TOKEN:', this.refreshToken ? '✅' : '❌');
            throw new Error('Missing Gmail API credentials in environment variables');
        }
        
        console.log('✅ Environment variables loaded');
        
        try {
            this.oauth2Client = new google.auth.OAuth2(
                this.clientId,
                this.clientSecret,
                'http://localhost:3000/auth/callback'
            );
            
            this.oauth2Client.setCredentials({
                refresh_token: this.refreshToken
            });
            
            this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
            console.log('✅ Gmail client initialized');
        } catch (error) {
            console.error('❌ Error initializing Gmail client:', error.message);
            throw error;
        }
        
        this.processedEmailsFile = path.join(__dirname, 'processed_emails.json');
        this.processedEmails = this.loadProcessedEmails();
        this.lastCheckTime = Date.now();
        
        // Image storage path
        this.imagesPath = path.join(__dirname, 'images');
        this.ensureImagesDirectory();
        
        console.log('✅ GmailNewsPoller initialized successfully');
    }

    ensureImagesDirectory() {
        try {
            if (!fs.existsSync(this.imagesPath)) {
                fs.mkdirSync(this.imagesPath, { recursive: true });
                console.log(`📁 Created images directory: ${this.imagesPath}`);
            }
        } catch (error) {
            console.error('❌ Error creating images directory:', error.message);
        }
    }

    loadProcessedEmails() {
        try {
            if (fs.existsSync(this.processedEmailsFile)) {
                const data = fs.readFileSync(this.processedEmailsFile, 'utf8');
                return new Set(JSON.parse(data));
            }
        } catch (error) {
            console.log('⚠️ Could not load processed emails file, starting fresh');
        }
        return new Set();
    }

    saveProcessedEmails() {
        try {
            fs.writeFileSync(this.processedEmailsFile, JSON.stringify([...this.processedEmails]));
        } catch (error) {
            console.error('❌ Error saving processed emails:', error.message);
        }
    }

    async authenticate() {
        try {
            const { credentials } = await this.oauth2Client.refreshAccessToken();
            this.oauth2Client.setCredentials(credentials);
            console.log('✅ Successfully authenticated with Gmail API');
            return true;
        } catch (error) {
            console.error('❌ Authentication failed:', error.message);
            return false;
        }
    }

    async searchNewsEmails() {
        try {
            // Search broadly for gmail.com emails and filter client-side
            const query = 'from:gmail.com';
            
            const response = await this.gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults: 100
            });

            const messages = response.data.messages || [];
            const filteredMessages = [];
            
            // Get email details and filter for emails ending with "nix@gmail.com"
            for (const message of messages) {
                try {
                    const msgDetails = await this.gmail.users.messages.get({
                        userId: 'me',
                        id: message.id,
                        format: 'metadata'
                    });
                    
                    const fromHeader = msgDetails.data.payload.headers.find(h => h.name === 'From');
                    if (fromHeader) {
                        // Extract email from "Name <email>" format or just "email"
                        const emailMatch = fromHeader.value.match(/<([^>]+)>|([^\s<>]+@[^\s<>]+)/);
                        const senderEmail = emailMatch ? (emailMatch[1] || emailMatch[2]) : '';
                        
                        // Check if email ends with "nix@gmail.com"
                        if (senderEmail.endsWith('nix@gmail.com')) {
                            filteredMessages.push(message);
                        }
                    }
                } catch (err) {
                    console.error(`Error getting message ${message.id}:`, err.message);
                }
            }
            
            // Filter out already processed emails
            const newMessages = filteredMessages.filter(msg => !this.processedEmails.has(msg.id));
            
            if (newMessages.length > 0) {
                console.log(`📧 Found ${newMessages.length} new emails ending with nix@gmail.com`);
            }
            
            return newMessages;
        } catch (error) {
            console.error('❌ Error searching emails:', error.message);
            return [];
        }
    }

    isImageFile(filename, mimeType) {
        if (!filename) return false;
        
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg'];
        const imageMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 
            'image/webp', 'image/tiff', 'image/svg+xml'
        ];
        
        const ext = path.extname(filename.toLowerCase());
        return imageExtensions.includes(ext) || imageMimeTypes.includes(mimeType);
    }

    async saveImageAttachment(messageId, attachment, attachmentData) {
        try {
            const timestamp = Date.now();
            const sanitizedFilename = attachment.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${messageId}_${timestamp}_${sanitizedFilename}`;
            const filePath = path.join(this.imagesPath, filename);
            
            fs.writeFileSync(filePath, attachmentData);
            console.log(`💾 Saved image: ${filename}`);
            return filePath;
        } catch (error) {
            console.error('❌ Error saving image attachment:', error.message);
            return null;
        }
    }

    async getEmailDetails(messageId) {
        try {
            const response = await this.gmail.users.messages.get({
                userId: 'me',
                id: messageId
            });

            const message = response.data;
            const headers = message.payload.headers;
            
            // Extract email metadata
            const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
            const date = headers.find(h => h.name === 'Date')?.value || 'Unknown Date';
            
            // --- ✅ Fixed body extraction ---
            function getPlainText(payload) {
                if (payload.mimeType === 'text/plain' && payload.body?.data) {
                    return Buffer.from(payload.body.data, 'base64').toString('utf8');
                }
                if (payload.parts) {
                    for (const part of payload.parts) {
                        const text = getPlainText(part);
                        if (text) return text;
                    }
                }
                return '';
            }

            const body = getPlainText(message.payload);
            // --- end fix ---

            // Process attachments and find images
            let savedImagePath = null;
            const attachments = [];
            
            if (message.payload.parts) {
                for (const part of message.payload.parts) {
                    if (part.filename && part.body.attachmentId) {
                        const attachmentData = await this.getAttachment(messageId, part.body.attachmentId);
                        
                        if (attachmentData) {
                            const attachmentInfo = {
                                filename: part.filename,
                                mimeType: part.mimeType,
                                size: part.body.size,
                                hasData: true
                            };
                            
                            attachments.push(attachmentInfo);
                            
                            // Check if this is an image and save it
                            if (this.isImageFile(part.filename, part.mimeType) && !savedImagePath) {
                                savedImagePath = await this.saveImageAttachment(messageId, attachmentInfo, attachmentData);
                            }
                        }
                    }
                }
            }

            return {
                id: messageId,
                subject,
                from,
                date,
                body: body,
                fullBody: body,
                bodyPreview: body.substring(0, 500) + (body.length > 500 ? '...' : ''),
                attachments: attachments,
                savedImagePath: savedImagePath
            };
        } catch (error) {
            console.error(`❌ Error getting email details for ${messageId}:`, error.message);
            return null;
        }
    }

    async getAttachment(messageId, attachmentId) {
        try {
            const response = await this.gmail.users.messages.attachments.get({
                userId: 'me',
                messageId: messageId,
                id: attachmentId
            });
            
            return Buffer.from(response.data.data, 'base64');
        } catch (error) {
            console.error(`❌ Error downloading attachment:`, error.message);
            return null;
        }
    }

    async processEmailWithNewsChecker(emailDetails) {
        try {
            console.log('🔄 Processing email with newsChecker...');
            
            // Call newsChecker with email text and image path (if available)
            const response = await newsChecker(emailDetails.fullBody, emailDetails.savedImagePath);
            console.log('✅ Email processed by newsChecker');
            return response;
        } catch (error) {
            console.error('❌ Error processing email with newsChecker:', error.message);
            return null;
        }
    }
}

// Create instance with error handling
let gmailPoller;
try {
    console.log('🔧 Creating Gmail poller instance...');
    gmailPoller = new GmailNewsPoller();
    console.log('✅ Gmail poller created successfully');
} catch (error) {
    console.error('❌ Failed to create Gmail poller:', error.message);
    process.exit(1);
}

// Initialize authentication with error handling
(async () => {
    try {
        console.log('🔐 Attempting authentication...');
        const authSuccess = await gmailPoller.authenticate();
        if (authSuccess) {
            console.log('✅ Authentication successful');
        } else {
            console.error('❌ Authentication failed');
        }
    } catch (error) {
        console.error('❌ Authentication error:', error.message);
    }
})();

// /news endpoint
app.get('/news', async (req, res) => {
    try {
        console.log('📡 /news endpoint hit');
        
        // Get new messages
        const newMessages = await gmailPoller.searchNewsEmails();
        
        if (newMessages.length === 0) {
            return res.json({
                success: true,
                message: 'No new emails found',
                data: []
            });
        }

        const processedResults = [];

        for (const message of newMessages) {
            const emailDetails = await gmailPoller.getEmailDetails(message.id);
            if (emailDetails) {
                // Process with newsChecker
                const newsResponse = await gmailPoller.processEmailWithNewsChecker(emailDetails);
                
                // Prepare result for frontend
                const result = {
                    messageId: emailDetails.id,
                    subject: emailDetails.subject,
                    from: emailDetails.from,
                    date: emailDetails.date,
                    newsText: newsResponse || 'No news response',
                    imagePath: emailDetails.savedImagePath || null,
                    // Convert image path to relative path for frontend
                    imageUrl: emailDetails.savedImagePath ? 
                        `/images/${path.basename(emailDetails.savedImagePath)}` : null
                };
                
                processedResults.push(result);
                
                // Mark as processed
                gmailPoller.processedEmails.add(message.id);
            }
        }
        
        // Save processed emails
        gmailPoller.saveProcessedEmails();
        
        res.json({
            success: true,
            message: `Found ${processedResults.length} new emails`,
            data: processedResults
        });
        
    } catch (error) {
        console.error('❌ Error in /news endpoint:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error processing emails',
            error: error.message
        });
    }
});

// Serve images statically - using relative path
app.use('/images', express.static(path.join(__dirname, 'images')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start server with error handling
try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Gmail News Server running on http://localhost:${PORT}`);
        console.log(`📡 API endpoint: http://localhost:${PORT}/news`);
        console.log(`🖼️ Images served at: http://localhost:${PORT}/images/`);
        console.log('💡 Ready to receive requests!');
    });
} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
}