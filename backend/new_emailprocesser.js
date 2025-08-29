const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const app=require('express')()
const cors=require('cors')


app.use(cors())

// Import your newsChecker function
const { newsChecker } = require('../backend/src/controllers/AISetup.js'); // Adjust path as needed

class GmailNewsPoller {
    constructor() {
        this.clientId = process.env.CLIENT_ID;
        this.clientSecret = process.env.CLIENT_SECRET;
        this.refreshToken = process.env.REFRESH_TOKEN;
        
        this.oauth2Client = new google.auth.OAuth2(
            this.clientId,
            this.clientSecret,
            'http://localhost:3000/auth/callback'
        );
        
        this.oauth2Client.setCredentials({
            refresh_token: this.refreshToken
        });
        
        this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
        this.processedEmailsFile = path.join(__dirname, 'processed_emails.json');
        this.processedEmails = this.loadProcessedEmails();
        this.lastCheckTime = Date.now();
        this.isRunning = false;
        
        // Image storage path
        this.imagesPath = 'W:\\SmallTown\\backend\\images';
        this.ensureImagesDirectory();
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
            const query = 'from:shkniX@gmail.com';
            
            const response = await this.gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults: 10
            });

            const messages = response.data.messages || [];
            
            // Filter out already processed emails
            const newMessages = messages.filter(msg => !this.processedEmails.has(msg.id));
            
            if (newMessages.length > 0) {
                console.log(`📧 Found ${newMessages.length} new emails FROM shkniX@gmail.com`);
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

    // async getEmailDetails(messageId) {
    //     try {
    //         const response = await this.gmail.users.messages.get({
    //             userId: 'me',
    //             id: messageId
    //         });

    //         const message = response.data;
    //         const headers = message.payload.headers;
            
    //         // Extract email metadata
    //         const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    //         const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
    //         const date = headers.find(h => h.name === 'Date')?.value || 'Unknown Date';
            
    //         // Get email body
    //         let body = '';
    //         if (message.payload.body.data) {
    //             body = Buffer.from(message.payload.body.data, 'base64').toString();
    //         } else if (message.payload.parts) {
    //             const textPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
    //             if (textPart && textPart.body.data) {
    //                 body = Buffer.from(textPart.body.data, 'base64').toString();
    //             }
    //         }

    //         // Process attachments and find images
    //         let savedImagePath = null;
    //         const attachments = [];
            
    //         if (message.payload.parts) {
    //             for (const part of message.payload.parts) {
    //                 if (part.filename && part.body.attachmentId) {
    //                     const attachmentData = await this.getAttachment(messageId, part.body.attachmentId);
                        
    //                     if (attachmentData) {
    //                         const attachmentInfo = {
    //                             filename: part.filename,
    //                             mimeType: part.mimeType,
    //                             size: part.body.size,
    //                             hasData: true
    //                         };
                            
    //                         attachments.push(attachmentInfo);
                            
    //                         // Check if this is an image and save it
    //                         if (this.isImageFile(part.filename, part.mimeType) && !savedImagePath) {
    //                             savedImagePath = await this.saveImageAttachment(messageId, attachmentInfo, attachmentData);
    //                         }
    //                     }
    //                 }
    //             }
    //         }

    //         return {
    //             id: messageId,
    //             subject,
    //             from,
    //             date,
    //             body: body,
    //             fullBody: body, // Keep full body for newsChecker
    //             bodyPreview: body.substring(0, 500) + (body.length > 500 ? '...' : ''), // Truncate for display only
    //             attachments: attachments,
    //             savedImagePath: savedImagePath
    //         };
    //     } catch (error) {
    //         console.error(`❌ Error getting email details for ${messageId}:`, error.message);
    //         return null;
    //     }
    // }

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
                fullBody: body, // Keep full body for newsChecker
                bodyPreview: body.substring(0, 500) + (body.length > 500 ? '...' : ''), // Truncate for display only
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

    displayEmailInfo(emailDetails) {
        console.log('\n' + '='.repeat(80));
        console.log('📬 NEW EMAIL RECEIVED');
        console.log('='.repeat(80));
        console.log(`📧 From: ${emailDetails.from}`);
        console.log(`📋 Subject: ${emailDetails.subject}`);
        console.log(`📅 Date: ${emailDetails.date}`);
        console.log(`🆔 Message ID: ${emailDetails.id}`);
        console.log('\n📄 Body Preview:');
        console.log('-'.repeat(40));
        console.log(emailDetails.bodyPreview);
        console.log('-'.repeat(40));
        
        if (emailDetails.attachments.length > 0) {
            console.log('\n📎 Attachments:');
            emailDetails.attachments.forEach((att, index) => {
                console.log(`  ${index + 1}. ${att.filename}`);
                console.log(`     Type: ${att.mimeType}`);
                console.log(`     Size: ${att.size} bytes`);
                console.log(`     Downloaded: ${att.hasData ? '✅' : '❌'}`);
            });
        } else {
            console.log('\n📎 No attachments found');
        }

        if (emailDetails.savedImagePath) {
            console.log(`\n🖼️ Image saved to: ${emailDetails.savedImagePath}`);
        }
        
        console.log('='.repeat(80) + '\n');
    }

    async processEmailWithNewsChecker(emailDetails) {
        try {
            console.log('🔄 Processing email with newsChecker...');
            
            // Call newsChecker with email text and image path (if available)
            const response=await newsChecker(emailDetails.fullBody, emailDetails.savedImagePath);
            // console.log(response)
            return response
            
            console.log('✅ Email processed by newsChecker');
        } catch (error) {
            console.error('❌ Error processing email with newsChecker:', error.message);
        }
    }

    async pollEmails() {
        if (this.isRunning) return;
        
        console.log('🔄 Starting Gmail polling for emails FROM shkniX@gmail.com...');
        this.isRunning = true;

        while (this.isRunning) {
            try {
                const newMessages = await this.searchNewsEmails();
                return newMessages
                for (const message of newMessages) {
                    const emailDetails = await this.getEmailDetails(message.id);
                    if (emailDetails) {
                        this.displayEmailInfo(emailDetails);
                        
                        // Process with newsChecker
                        const response=await this.processEmailWithNewsChecker(emailDetails);
                        console.log("Processor: ",response)
                        
                        this.processedEmails.add(message.id);
                        this.saveProcessedEmails(); // Save after each processed email
                    }
                }
                
                // Wait 30 seconds before next poll
                await new Promise(resolve => setTimeout(resolve, 30000));
                
            } catch (error) {
                console.error('❌ Polling error:', error.message);
                await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute on error
            }
        }
    }

    stop() {
        this.isRunning = false;
        this.saveProcessedEmails(); // Save before stopping
        console.log('⏹️ Gmail polling stopped');
    }

    async start() {
        const authSuccess = await this.authenticate();
        if (authSuccess) {
            await this.pollEmails();
        } else {
            console.error('❌ Cannot start polling without authentication');
        }
    }
}

// Usage
app.get('/news',(req,res)=>{
       
     return 
})
async function main() {
    const poller = new GmailNewsPoller();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down...');
        poller.stop();
        process.exit(0);
    });
    
    await poller.start();
}

// Export for use as module
module.exports = GmailNewsPoller;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}