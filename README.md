# Joe - Chat with AI

A simple, fast ChatGPT-like chat interface powered by Joe—an AI assistant that answers questions, helps with coding, and more.

## ✨ Features

✅ **Clean Chat Interface** - Modern, minimal design  
✅ **Fast Responses** - Instant replies with thinking indicator  
✅ **Coding Help** - Get code examples and explanations  
✅ **Mobile Responsive** - Works perfectly on any device  
✅ **Built with React** - Fast and reliable  

---

## 🚀 Quick Start (5 minutes)

### 1️⃣ Prerequisites
Make sure you have:
- **Node.js** installed (https://nodejs.org/)

### 2️⃣ Run Locally

```bash
cd c:\Users\chidi\Desktop\joe

npm run dev
```

Your app opens at: **http://localhost:5173/**

### 3️⃣ Start Chatting
- Type your question in the input box
- Press Enter or click Send
- Joe will respond instantly

---

## 📝 How to Use

### Ask Questions
1. Type anything in the chat box
2. Press Enter or click the Send button
3. Joe responds with helpful information

### Example Questions
- "hello" - Friendly greeting
- "help with code" - Get JavaScript examples
- "who are you" - About Joe
- "what time is it" - Current date and time
- "calculate 2+2" - Math help

---

## 🌐 Deploy

### **Deploy to Netlify**

1. Build the app:
   ```bash
   npm run build
   ```

2. Go to **https://netlify.com** and sign up

3. Drag & drop the **`dist`** folder into Netlify

4. Your app is live!

### **Deploy to Vercel**

1. Build the app:
   ```bash
   npm run build
   ```

2. Go to **https://vercel.com** and create a new project

3. Upload the folder and Vercel deploys automatically

---

## 🔧 Customize Joe's Responses

Edit `src/App.tsx` and find the `generateResponse` function (around line 26):

```typescript
// Add your own response logic
if (msg.includes('your topic')) {
  return 'Your custom response here!';
}
```

**Example: Make Joe answer pizza questions**
```typescript
if (msg.includes('pizza')) {
  return 'I love pizza! Did you know Margherita pizza represents the colors of Italy?';
}
```

---

## 🎨 Customize Colors

Edit `src/App.css` to change colors:

```css
:root {
  --user-bg: #10a37f;    /* Your message color */
  --joe-bg: #f7f7f8;     /* Joe's message color */
  --accent: #10a37f;     /* Button color */
}
```

---

## 📦 Project Structure

```
joe/
├── src/
│   ├── App.tsx          ← Main chat component
│   ├── App.css          ← Styling
│   ├── index.css        ← Global styles
│   └── main.tsx         ← Entry point
├── package.json         ← Dependencies
├── vite.config.ts       ← Build config
└── README.md            ← This file
```

---

## 🛠️ Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔌 Connect Real AI (Optional)

Want to use ChatGPT API instead of demo responses?

1. Get API key from https://platform.openai.com

2. Install OpenAI library:
   ```bash
   npm install openai
   ```

3. Update `src/App.tsx`:
   ```typescript
   import OpenAI from 'openai';

   const client = new OpenAI({
     apiKey: 'your-api-key',
     dangerouslyAllowBrowser: true
   });

   const generateResponse = async (msg: string) => {
     const response = await client.chat.completions.create({
       model: 'gpt-3.5-turbo',
       messages: [{ role: 'user', content: msg }],
       max_tokens: 500,
     });
     return response.choices[0].message.content;
   };
   ```

---

## 🆘 Troubleshooting

### App won't start?
```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

---

## 📱 Mobile Friendly

- Responsive design works on all devices
- Touch-friendly buttons
- Perfect for phone and tablet

---

## 🎯 Next Steps

1. Run it locally with `npm run dev`
2. Deploy to Netlify or Vercel
3. Customize Joe's responses
4. (Optional) Connect real ChatGPT API
5. Share with friends!

---

## 📚 Learn More

- **React**: https://react.dev
- **Vite**: https://vite.dev
- **Netlify**: https://netlify.com
- **Vercel**: https://vercel.com
- **OpenAI API**: https://platform.openai.com

---

**Have fun building! 🚀**
