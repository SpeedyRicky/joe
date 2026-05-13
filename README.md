# Joe - ChatGPT Clone

A beautiful, dark-mode ChatGPT clone with chat history, image generation, and instant deployment to Vercel.

## ✨ Features

✅ **ChatGPT-like Dark Interface** - Modern, minimalist design  
✅ **Chat History** - Save and manage multiple conversations  
✅ **Image Generation** - Generate and display images  
✅ **Persistent Storage** - Chats saved in browser (localStorage)  
✅ **Mobile Responsive** - Works on all devices  
✅ **Vercel Ready** - One-click deployment  
✅ **Fast** - Built with React + Vite  

---

## 🚀 Quick Start (3 minutes)

### Prerequisites
- **Node.js** (https://nodejs.org/)

### Run Locally

```bash
cd c:\Users\chidi\Desktop\joe

npm run dev
```

Open: **http://localhost:5173/**

---

## 📝 How to Use

1. **Type a message** in the input box
2. **Press Enter** or click Send
3. **Joe responds** instantly
4. **Chats are saved** automatically
5. **Create new chats** with the "+ New Chat" button
6. **Delete chats** by clicking the trash icon

### Try These:
- "hello" - Friendly greeting
- "help with code" - Get code examples
- "generate image of a cat" - Generate an image
- "who are you" - About Joe
- "what time is it" - Current time

---

## 🌐 Deploy to Vercel (Free)

### Option 1: Git + Vercel (Easiest)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/joe
   git push -u origin main
   ```

2. Go to **https://vercel.com**

3. Click "New Project" → Select your GitHub repo

4. Vercel deploys automatically!

### Option 2: Direct Upload

1. Build the app:
   ```bash
   npm run build
   ```

2. Go to **https://vercel.com/new**

3. Upload the entire folder

4. Your app is live!

### Option 3: Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## 🔧 Customize

### Change AI Responses

Edit `src/App.tsx` - find the `generateResponse` function:

```typescript
if (msg.includes('your topic')) {
  return { text: 'Your custom response' };
}
```

### Change Colors

Edit `src/App.css` - modify the `:root` variables:

```css
:root {
  --user-bg: #10a37f;      /* User message color */
  --accent: #10a37f;       /* Button color */
  --bg-primary: #0d0d0d;   /* Background */
}
```

### Add Real AI API

Replace `generateResponse` in `src/App.tsx`:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

const generateResponse = async (msg: string) => {
  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: msg }],
  });
  return { text: response.choices[0].message.content };
};
```

---

## 📦 Project Structure

```
joe/
├── src/
│   ├── App.tsx           ← Chat logic + UI
│   ├── App.css           ← Styling
│   ├── index.css         ← Global styles
│   └── main.tsx          ← Entry point
├── public/               ← Static files
├── vercel.json           ← Vercel config
├── vite.config.ts        ← Vite config
├── package.json          ← Dependencies
└── README.md
```

---

## 🛠️ Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 💾 Data Storage

- **Chat History** - Stored in browser's localStorage
- **Auto-saves** - Every message is saved automatically
- **No Server Needed** - Everything runs locally
- **Privacy** - Your data never leaves your device

---

## 🆘 Troubleshooting

### App won't start?
```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Chats not saving?
- Clear browser cache
- Check if localStorage is enabled
- Try a different browser

### Port already in use?
```bash
npm run dev -- --port 3000
```

### Deployment fails?
- Make sure `npm run build` works locally
- Check that all dependencies are in `package.json`
- Verify `vercel.json` exists

---

## 📱 Mobile Support

✅ Fully responsive  
✅ Touch-friendly UI  
✅ Sidebar collapses on mobile  
✅ Works on iOS & Android  

---

## 🎯 Next Steps

1. ✅ Run locally: `npm run dev`
2. 🌐 Deploy: Push to Vercel
3. 🎨 Customize: Edit responses and colors
4. 🤖 (Optional) Add real ChatGPT API
5. 🚀 Share with friends!

---

## 📚 Learn More

- **React**: https://react.dev
- **Vite**: https://vite.dev
- **Vercel**: https://vercel.com
- **OpenAI API**: https://platform.openai.com

---

**Built with React + Vite | Deployed on Vercel | Open Source**
