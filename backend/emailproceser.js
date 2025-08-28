// const { google } = require('googleapis');
// require('dotenv').config();

// class GmailNewsPoller {
//     constructor() {
//         this.clientId = process.env.CLIENT_ID;
//         this.clientSecret = process.env.CLIENT_SECRET;
//         this.refreshToken = process.env.REFRESH_TOKEN;
        
//         this.oauth2Client = new google.auth.OAuth2(
//             this.clientId,
//             this.clientSecret,
//             'http://localhost:3000/auth/callback'
//         );
        
//         this.oauth2Client.setCredentials({
//             refresh_token: this.refreshToken
//         });
        
//         this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
//         this.processedEmails = new Set();
//         this.isRunning = false;
//     }

//     async authenticate() {
//         try {
//             const { credentials } = await this.oauth2Client.refreshAccessToken();
//             this.oauth2Client.setCredentials(credentials);
//             console.log('✅ Successfully authenticated with Gmail API');
//             return true;
//         } catch (error) {
//             console.error('❌ Authentication failed:', error.message);
//             return false;
//         }
//     }

//     async searchNewsEmails() {
//         try {
//             // const query = 'from:shknix@gmail.com has:attachment';
//             const query = 'from:shknix@gmail.com';
            
//             const response = await this.gmail.users.messages.list({
//                 userId: 'me',
//                 q: query,
//                 maxResults: 10
//             });

//             const messages = response.data.messages || [];
            
//             // Filter out already processed emails
//             const newMessages = messages.filter(msg => !this.processedEmails.has(msg.id));
            
//             if (newMessages.length > 0) {
//                 console.log(`📧 Found ${newMessages.length} new emails FROM nix@gmail.com`);
//             }
            
//             return newMessages;
//             // return messages;
//         } catch (error) {
//             console.error('❌ Error searching emails:', error.message);
//             return [];
//         }
//     }

//     async getEmailDetails(messageId) {
//         try {
//             const response = await this.gmail.users.messages.get({
//                 userId: 'me',
//                 id: messageId
//             });

//             const message = response.data;
//             const headers = message.payload.headers;
            
//             // Extract email metadata
//             const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
//             const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
//             const date = headers.find(h => h.name === 'Date')?.value || 'Unknown Date';
            
//             // Get email body
//             let body = '';
//             if (message.payload.body.data) {
//                 body = Buffer.from(message.payload.body.data, 'base64').toString();
//             } else if (message.payload.parts) {
//                 const textPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
//                 if (textPart && textPart.body.data) {
//                     body = Buffer.from(textPart.body.data, 'base64').toString();
//                 }
//             }

//             // Get attachments
//             const attachments = [];
//             if (message.payload.parts) {
//                 for (const part of message.payload.parts) {
//                     if (part.filename && part.body.attachmentId) {
//                         const attachment = await this.getAttachment(messageId, part.body.attachmentId);
//                         attachments.push({
//                             filename: part.filename,
//                             mimeType: part.mimeType,
//                             size: part.body.size,
//                             data: attachment
//                         });
//                     }
//                 }
//             }

//             return {
//                 id: messageId,
//                 subject,
//                 from,
//                 date,
//                 body: body.substring(0, 500) + (body.length > 500 ? '...' : ''), // Truncate for display
//                 attachments: attachments.map(att => ({
//                     filename: att.filename,
//                     mimeType: att.mimeType,
//                     size: att.size,
//                     hasData: !!att.data
//                 }))
//             };
//         } catch (error) {
//             console.error(`❌ Error getting email details for ${messageId}:`, error.message);
//             return null;
//         }
//     }

//     async getAttachment(messageId, attachmentId) {
//         try {
//             const response = await this.gmail.users.messages.attachments.get({
//                 userId: 'me',
//                 messageId: messageId,
//                 id: attachmentId
//             });
            
//             return Buffer.from(response.data.data, 'base64');
//         } catch (error) {
//             console.error(`❌ Error downloading attachment:`, error.message);
//             return null;
//         }
//     }

//     displayEmailInfo(emailDetails) {
//         console.log('\n' + '='.repeat(80));
//         console.log('📬 NEW EMAIL RECEIVED');
//         console.log('='.repeat(80));
//         console.log(`📧 From: ${emailDetails.from}`);
//         console.log(`📋 Subject: ${emailDetails.subject}`);
//         console.log(`📅 Date: ${emailDetails.date}`);
//         console.log(`🆔 Message ID: ${emailDetails.id}`);
//         console.log('\n📄 Body Preview:');
//         console.log('-'.repeat(40));
//         console.log(emailDetails.body);
//         console.log('-'.repeat(40));
        
//         if (emailDetails.attachments.length > 0) {
//             console.log('\n📎 Attachments:');
//             emailDetails.attachments.forEach((att, index) => {
//                 console.log(`  ${index + 1}. ${att.filename}`);
//                 console.log(`     Type: ${att.mimeType}`);
//                 console.log(`     Size: ${att.size} bytes`);
//                 console.log(`     Downloaded: ${att.hasData ? '✅' : '❌'}`);
//             });
//         } else {
//             console.log('\n📎 No attachments found');
//         }
//         console.log('='.repeat(80) + '\n');
//     }

//     async pollEmails() {
//         if (this.isRunning) return;
        
//         console.log('🔄 Starting Gmail polling for emails FROM nix@gmail.com...');
//         this.isRunning = true;

//         while (this.isRunning) {
//             try {
//                 const newMessages = await this.searchNewsEmails();
               
                
//                 for (const message of newMessages) {
//                     console.log("message",message)
//                     const emailDetails = await this.getEmailDetails(message.id);
//                     if (emailDetails) {
//                         this.displayEmailInfo(emailDetails);
//                         this.processedEmails.add(message.id);
//                     }
//                 }
                
//                 // Wait 30 seconds before next poll
//                 await new Promise(resolve => setTimeout(resolve, 30000));
                
//             } catch (error) {
//                 console.error('❌ Polling error:', error.message);
//                 await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute on error
//             }
//         }
//     }

//     stop() {
//         this.isRunning = false;
//         console.log('⏹️ Gmail polling stopped');
//     }

//     async start() {
//         const authSuccess = await this.authenticate();
//         if (authSuccess) {
//             await this.pollEmails();
//         } else {
//             console.error('❌ Cannot start polling without authentication');
//         }
//     }
// }

// // Usage
// async function main() {
//     const poller = new GmailNewsPoller();
    
//     // Handle graceful shutdown
//     process.on('SIGINT', () => {
//         console.log('\n🛑 Shutting down...');
//         poller.stop();
//         process.exit(0);
//     });
    
//     await poller.start();
// }

// // Export for use as module
// module.exports = GmailNewsPoller;

// // Run if called directly
// if (require.main === module) {
//     main().catch(console.error);
// }



const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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
            
            // Get email body
            let body = '';
            if (message.payload.body.data) {
                body = Buffer.from(message.payload.body.data, 'base64').toString();
            } else if (message.payload.parts) {
                const textPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
                if (textPart && textPart.body.data) {
                    body = Buffer.from(textPart.body.data, 'base64').toString();
                }
            }

            // Get attachments
            const attachments = [];
            if (message.payload.parts) {
                for (const part of message.payload.parts) {
                    if (part.filename && part.body.attachmentId) {
                        const attachment = await this.getAttachment(messageId, part.body.attachmentId);
                        attachments.push({
                            filename: part.filename,
                            mimeType: part.mimeType,
                            size: part.body.size,
                            data: attachment
                        });
                    }
                }
            }

            return {
                id: messageId,
                subject,
                from,
                date,
                body: body.substring(0, 500) + (body.length > 500 ? '...' : ''), // Truncate for display
                attachments: attachments.map(att => ({
                    filename: att.filename,
                    mimeType: att.mimeType,
                    size: att.size,
                    hasData: !!att.data
                }))
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
        console.log(emailDetails.body);
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
        console.log('='.repeat(80) + '\n');
    }

    async pollEmails() {
        if (this.isRunning) return;
        
        console.log('🔄 Starting Gmail polling for emails FROM shkniX@gmail.com...');
        this.isRunning = true;

        while (this.isRunning) {
            try {
                const newMessages = await this.searchNewsEmails();
                
                for (const message of newMessages) {
                    const emailDetails = await this.getEmailDetails(message.id);
                    if (emailDetails) {
                        this.displayEmailInfo(emailDetails);
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