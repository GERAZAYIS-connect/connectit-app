import { supabase } from "../lib/supabase";
import { Gemini_api } from '../constants';

export const fetchMessages = async (userId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
  return data;
};

export const sendMessage = async (userId, text) => {
  const { error } = await supabase
    .from('messages')
    .insert([{ userId, user: 'user', text }]);

  if (error) {
    console.error('Erreur lors de l\'ajout du message:', error);
    return false;
  }
  return true;
};

export const fetchGPTResponse = async (userInput) => {
  try {
    let responseText = '';

    // Réponses personnalisées
    if (userInput.toLowerCase().includes('qui es-tu')) {
      responseText = "Je suis Gconnect IT, le bot qui vous accompagne dans vos tâches connectiques.";
    } else if (userInput.toLowerCase().includes('créateur')) {
      responseText = "Mon créateur est Gervais Azanga Ayissi.";
    } else {
      // Requête normale à l'API Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${Gemini_api}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userInput,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data && data.candidates && data.candidates.length > 0) {
        responseText = data.candidates[0].content.parts[0].text.trim();
      } else {
        responseText = 'Désolé, je ne peux pas répondre pour le moment.';
      }
    }

    return responseText;
  } catch (error) {
    console.error('Erreur lors de la récupération de la réponse Gemini:', error);
    return 'Désolé, je ne peux pas répondre pour le moment.';
  }
};

export const saveBotResponse = async (userId, text) => {
  const { error } = await supabase
    .from('messages')
    .insert([{ userId, user: 'bot', text }]);

  if (error) {
    console.error('Erreur lors de l\'ajout de la réponse du bot:', error);
    return false;
  }
  return true;
};