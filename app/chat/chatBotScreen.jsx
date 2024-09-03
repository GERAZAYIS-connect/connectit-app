import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../../lib/supabase";
import { Gemini_api } from '../../services/botSevices';
import { Header } from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import Avatar from '../../components/avatar';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';


const ChatbotScreen = () => {
  const {user, setAuth} = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);  // Nouvel état pour l'animation d'écriture du bot

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    } else {
      setMessages(data);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim().length === 0) return;

    const newMessage = { user: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    const { error } = await supabase
      .from('messages')
      .insert([{ user: 'user', text: input, created_at: new Date() }]);

    if (error) {
      console.error('Erreur lors de l\'ajout du message:', error);
    }

    setInput('');
    setIsTyping(true);  // Le bot commence à écrire mais je dois reffaire des revisions ici

    const response = await fetchGPTResponse(input);
    if (response) {
      const botMessage = { user: 'bot', text: response };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      const { error } = await supabase
        .from('messages')
        .insert([{ user: 'bot', text: response, created_at: new Date() }]);

      if (error) {
        console.error('Erreur lors de l\'ajout de la réponse du bot:', error);
      }
    }

    setIsTyping(false); 
  };

  const fetchGPTResponse = async (userInput) => {
    try {
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
        const outputText = data.candidates[0].content.parts[0].text;
        return outputText.trim();
      } else {
        throw new Error('La réponse de l\'API Gemini est invalide ou vide.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la réponse Gemini:', error);
      return 'Désolé, je ne peux pas répondre pour le moment.';
    }
  };

const renderMessage = ({ item }) => (
  <View style={item.user === 'user' ? styles.userMessageContainer : styles.botMessageContainer}>
    {item.user === 'user' ? (
      <View style={styles.userHeader}>
        <Avatar
          size={hp(4.5)}
          uri={user?.image}
          rounded={theme.radius.md}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
          <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
        </View>
      </View>
    ) : (
      <View style={styles.botHeader}>
        <View style={styles.botInfo}>
          <Text style={styles.botName}>Bot</Text>
          <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
        </View>
        <View style={styles.avatar}>
          <Avatar
            size={hp(4.5)}
            uri={require('../../assets/images/bot.png')}
            rounded={theme.radius.md}
          />
        </View>
      </View>
    )}
    <Text style={item.user === 'user' ? styles.userMessageText : styles.botMessageText}>
      {item.text}
    </Text>
  </View>
);



  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4), top: 5 }}>
      <View style={{ top: 20 }}>
        <Header title="ConnectIT bot" mb={30} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.chatContainer}
        />

        {/* Animation de saisie du bot a redefinir aussi */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.typingText}>ConnectIT bot est en train d'écrire...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Tapez votre message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userMessageContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    maxWidth: '80%',
  },
  botMessageContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    maxWidth: '80%',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  userInfo: {
    marginLeft: 10,
  },
  botInfo: {
    marginRight: 10,
    alignItems: 'flex-end',
  },
  userName: {
    fontWeight: 'bold',
  },
  botName: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
  },
  userMessageText: {
    backgroundColor: '#2196F3',
    color: '#fff',
    borderRadius: 15,
    padding: 10,
    alignSelf: 'flex-start',
  },
  botMessageText: {
    backgroundColor: '#E1E1E1',
    color: '#000',
    borderRadius: 15,
    padding: 10,
    alignSelf: 'flex-end',
  },
inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
    avatar: {
    width: hp(4.5),
    height:hp(4.5),
    borderRadius: 15,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
});

export default ChatbotScreen;
