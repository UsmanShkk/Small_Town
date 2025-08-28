// // // Install: npm install openai

// // const OpenAI = require('openai');
// // const fs = require('fs');
// // require('dotenv').config();

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY
// // });

// // async function analyze() {
// //     const response = await openai.chat.completions.create({
// //         model: "gpt-4o-mini",
// //         messages: [
// //         {
// //             role: "system",
// //             content: "You are a helpful assistant that explains things very simply."
// //         },
// //         {
// //             role: "user",
// //             content: "Hello"
// //             }
// //             ]
// //         }

// //     );
// //     console.log(response.choices[0].message.content);
// // }
// // analyze()

// const OpenAI = require("openai");
// const fs = require("fs");
// require("dotenv").config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function analyzeLocalImage(prompt, imagePath) {
//   // Read image from your system
//   const imageBuffer = fs.readFileSync(imagePath);
//   const base64Image = imageBuffer.toString("base64");

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: "You are an assistant that describes images clearly.",
//       },
//       {
//         role: "user",
//         content: [
//           { type: "text", text: prompt },
//           {
//             type: "image_url",
//             image_url: {
//               url: `data:image/jpeg;base64,${base64Image}`, // 👈 local system image
//             },
//           },
//         ],
//       },
//     ],
//     max_tokens: 300,
//   });

//   console.log(response.choices[0].message.content);
// }

// // Example: pass any image from your system
// analyzeLocalImage("What’s in this picture?", "U:/Projects/LLM-by-Arif/LANGCHAIN/images/Model.png");

// const fs = require("fs");
// const path = require("path");
// const OpenAI = require("openai");
// require("dotenv").config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// async function newsChecker(emailText, imagePath = null) {
//   // Build user content
//   const userContent = [
//     { type: "text", text: emailText }
//   ];

//   // If image exists
//   if (imagePath) {
//     const fullPath = path.resolve(imagePath);

//     if (!fs.existsSync(fullPath)) {
//       console.error(`❌ File not found: ${fullPath}`);
//       return;
//     }

//     const imageBuffer = fs.readFileSync(fullPath);
//     const base64Image = imageBuffer.toString("base64");

//     userContent.push({
//       type: "image_url",
//       image_url: { url: `data:image/png;base64,${base64Image}` }
//     });
//   }

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: `
// You are a News Checker assistant. 
// Your job:
// 1. If the image contains vulgar, violent, or extremely unsafe content → set "image": "not_accepted".
// 2. Otherwise set "image": "accepted".
// 3. Extract any place/location mentioned (e.g. "This incident happened at Karachi").
// 4. Write a short clean "summary" of what happened.
// 5. Determine "risk_level": low, medium, or high depending on severity.
// 6. Generate a user-friendly formatted "report_text" (clear, short, readable for public display).

// Always return valid JSON with this exact schema:
// {
//   "image": "accepted/not_accepted",
//   "place": "<detected place or null>",
//   "summary": "<short summary>",
//   "risk_level": "<low/medium/high>",
//   "report_text": "<user-friendly formatted text>"
// }
// Only output valid JSON, no extra commentary.
//         `
//       },
//       { role: "user", content: userContent }
//     ],
//     max_tokens: 500,
//     response_format: { type: "json_object" } // forces JSON output
//   });

//   console.log("✅ JSON Report:", response.choices[0].message.content);
// }

// // Example usage
// newsChecker(
//   "Breaking news! This incident happens at Lahore where a fire broke out and homes were damaged.",
//   "U:/Projects/LLM-by-Arif/LANGCHAIN/images/Model.png"
// );

const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function newsChecker(emailText, imagePath = null) {
  // Build user content
  const userContent = [
    { type: "text", text: emailText }
  ];

  // If image exists
  if (imagePath) {
    const fullPath = path.resolve(imagePath);

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`);
      return;
    }

    try {
      const imageBuffer = fs.readFileSync(fullPath);
      const base64Image = imageBuffer.toString("base64");
      
      // Detect image type from file extension or buffer
      const ext = path.extname(fullPath).toLowerCase();
      let mimeType = "image/png"; // default
      
      if (ext === '.jpg' || ext === '.jpeg') {
        mimeType = "image/jpeg";
      } else if (ext === '.png') {
        mimeType = "image/png";
      } else if (ext === '.gif') {
        mimeType = "image/gif";
      } else if (ext === '.webp') {
        mimeType = "image/webp";
      }

      userContent.push({
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${base64Image}` }
      });
      
      console.log(`📸 Added image to analysis: ${path.basename(fullPath)}`);
    } catch (error) {
      console.error(`❌ Error processing image: ${error.message}`);
    }
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a News Checker assistant. 
Your job:
1. If the image contains vulgar, violent, or extremely unsafe content → set "image": "not_accepted".
2. Otherwise set "image": "accepted".
3. Extract any place/location mentioned (e.g. "This incident happened at Karachi").
4. Write a short clean "summary" of what happened.
5. Determine "risk_level": low, medium, or high depending on severity.
6. Generate a user-friendly formatted "report_text" (clear, short, readable for public display).

Always return valid JSON with this exact schema:
{
  "image": "accepted/not_accepted",
  "place": "<detected place or null>",
  "summary": "<short summary>",
  "risk_level": "<low/medium/high>",
  "report_text": "<user-friendly formatted text>"
}
Only output valid JSON, no extra commentary.
          `
        },
        { role: "user", content: userContent }
      ],
      max_tokens: 500,
      response_format: { type: "json_object" } // forces JSON output
    });

    console.log("✅ JSON Report:", response.choices[0].message.content);
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error.message);
    return null;
  }
}

// Export the function
module.exports = { newsChecker };

// // Example usage (only runs if called directly)
// if (require.main === module) {
//   newsChecker(
//     "Breaking news! This incident happens at Lahore where a fire broke out and homes were damaged.",
//     "U:/Projects/LLM-by-Arif/LANGCHAIN/images/Model.png"
//   );
// }