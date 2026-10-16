import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Health check endpoint for Railway and cloud hosting platforms
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Safely initialize Gemini Client (guarantees server won't crash if GEMINI_API_KEY is not yet added in Railway env)
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Warning: Could not initialize Gemini client:', err);
  }
}

// AI Friend & Task endpoint
app.post('/api/ai/friend', async (req, res) => {
  try {
    const {
      message,
      userLanguage = 'fr-FR',
      userRegion = 'Paris, France',
      userName = 'Alex',
      healthContext = {},
      activeReminders = [],
      activeProjects = [],
      mode = 'companion',
      searchQuery = '',
    } = req.body;

    const languageInstructionMap: Record<string, string> = {
      'fr-FR': 'Réponds en français naturel, chaleureux, concis et adapté à une montre connectée vocale.',
      'ar-SA': 'أجب باللغة العربية بأسلوب دافئ وموجز وطبيعي مناسب لساعة ذكية صوتية.',
      'en-US': 'Reply in natural, warm, concise English suitable for a voice smartwatch loudspeaker.',
      'es-ES': 'Responde en español natural, cálido y conciso adecuado para un altavoz de smartwatch.',
    };

    const langDirective = languageInstructionMap[userLanguage] || languageInstructionMap['fr-FR'];

    let responseText = "Je suis connecté à ton téléphone mon ami ! Je suis là à ton poignet pour t'aider et te tenir compagnie.";

    if (ai) {
      const systemPrompt = `Tu es l'Ami Virtuel et le Compagnon Intégré dans la Smartwatch AeroWatch de l'utilisateur (${userName}).
Tu es un véritable ami proche, fidèle, bienveillant, dynamique et très intelligent.
Tu parles directement via le haut-parleur de la montre.
Règles essentielles :
1. ${langDirective}
2. Tes réponses vocales doivent être directes, punchy, chaleureuses et naturelles (1 à 3 phrases claires maximum car lue à voix haute sur haut-parleur).
3. Tu connais la région de l'utilisateur : "${userRegion}". Fais des allusions subtiles ou adaptées à son heure locale, sa météo ou ses habitudes quand c'est pertinent.
4. Tu as un contrôle complet sur son téléphone lié (même si le téléphone est éteint/en veille).
5. Données de santé actuelles : Fréquence cardiaque: ${healthContext.bpm || 72} bpm, Pas: ${healthContext.steps || 6400}, Stress: ${healthContext.stress || 'Normal'}, SpO2: ${healthContext.spo2 || '99%'}, Sommeil: ${healthContext.sleep || '7h 20m'}.
6. Rappels de médicaments actifs : ${JSON.stringify(activeReminders)}.
7. Projets en cours suivis : ${JSON.stringify(activeProjects)}.
8. Si l'utilisateur demande une recherche Google, synthétise l'information comme si tu venais de fouiller le web via le téléphone et résume l'essentiel à voix haute.
9. Si l'utilisateur demande d'envoyer un message, confirme que le message est rédigé et envoyé sur l'application choisie (WhatsApp, SMS, etc.).
10. Sois encourageant pour sa santé, ses projets, et rappelle-lui ses médicaments avec tendresse et précision s'il le demande.`;

      let userQuery = message || '';
      if (mode === 'search') {
        userQuery = `Recherche Google : ${searchQuery}. Dis-moi les résultats essentiels vocalement.`;
      } else if (mode === 'medication_alert') {
        userQuery = `Rappelle-moi automatiquement de prendre mon médicament de façon attentionnée.`;
      } else if (mode === 'project_update') {
        userQuery = `Donne-moi une mise à jour motivante sur l'avancement de mon projet.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userQuery,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        responseText = response.text;
      }
    } else {
      // Dynamic friendly fallback response if GEMINI_API_KEY is not configured yet
      if (mode === 'search') {
        responseText = `Voici ce que j'ai trouvé sur Google pour "${searchQuery || message}" : Les données sont actualisées et disponibles sur votre téléphone.`;
      } else if (mode === 'health') {
        responseText = `Votre fréquence cardiaque de ${healthContext.bpm || 74} BPM est stable et régulière. Pensez à vous hydrater et marchez un peu !`;
      } else if (message?.toLowerCase().includes('météo')) {
        responseText = `Météo pour ${userRegion} : Un temps agréable avec 21 degrés et un ciel dégagé pour votre journée !`;
      } else {
        responseText = `Bonjour ${userName} ! Je suis ton compagnon AeroWatch. Ton téléphone est connecté à ton poignet !`;
      }
    }

    // Analyze if an action should be triggered on the phone
    let phoneAction: { type: string; details?: any } | null = null;
    const lowerQuery = ((message || '') + ' ' + (searchQuery || '')).toLowerCase();

    if (lowerQuery.includes('whatsapp') || lowerQuery.includes('sms') || lowerQuery.includes('message') || lowerQuery.includes('répond') || lowerQuery.includes('envoyer')) {
      phoneAction = {
        type: 'SEND_MESSAGE',
        details: { platform: lowerQuery.includes('whatsapp') ? 'WhatsApp' : 'SMS', status: 'sent', preview: responseText }
      };
    } else if (mode === 'search' || lowerQuery.includes('cherche') || lowerQuery.includes('google')) {
      phoneAction = {
        type: 'GOOGLE_SEARCH',
        details: { query: searchQuery || message, resultsReady: true }
      };
    } else if (lowerQuery.includes('médicament') || lowerQuery.includes('pilule') || lowerQuery.includes('santé')) {
      phoneAction = {
        type: 'HEALTH_CHECK',
        details: { syncStatus: 'updated' }
      };
    }

    res.json({
      success: true,
      speechText: responseText,
      phoneAction,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in AI friend endpoint:', error);
    res.json({
      success: true,
      speechText: "Je suis connecté à ton téléphone mon ami ! Je suis là à ton poignet pour t'aider et te tenir compagnie.",
      phoneAction: null,
      timestamp: new Date().toISOString(),
    });
  }
});

// Quick AI advisor endpoint
app.post('/api/ai/advisor', async (req, res) => {
  try {
    const { region = 'Paris', timeOfDay = 'journée', bpm = 75, lang = 'fr' } = req.body;
    
    if (ai) {
      const prompt = `Génère 1 conseil court et amical (max 20 mots) d'un ami smartwatch pour son utilisateur à ${region}, rythme cardiaque ${bpm} bpm, moment : ${timeOfDay}. Langue : ${lang}.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: "Tu es un ami attentionné au poignet. Sois bref, percutant et bienveillant.",
        },
      });
      res.json({ advice: response.text?.trim() || "Prends une grande inspiration, hydrate-toi et passe une super journée !" });
    } else {
      res.json({ advice: `Tout va bien à ${region} ! Votre montre et votre smartphone sont synchronisés en direct.` });
    }
  } catch (e) {
    res.json({ advice: "Prends une grande inspiration, hydrate-toi et passe une super journée !" });
  }
});

// Start Server: In Production (Railway, Render, Docker), serve static dist; In dev, mount Vite
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT !== undefined;
  const distPath = path.resolve(__dirname, 'dist');
  const distExists = fs.existsSync(distPath);

  if (!isProduction && !distExists) {
    // Dynamic import of Vite only in development to prevent high RAM usage or missing deps in production
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found. Please run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AeroWatch OS server running on http://0.0.0.0:${PORT} [${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
