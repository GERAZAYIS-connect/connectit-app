import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import Avatar from '../../components/avatar';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { sendMessage, fetchGPTResponse, saveBotResponse } from '../../services/botSevices';

const prompts = [
  "Quel est le dernier framework en JavaScript que je devrais apprendre?",
  "Quelles sont les meilleures pratiques pour réussir ses études en technologie?",
  "Comment puis-je contribuer à des projets open source en tant qu'étudiant?"
];

const ChatbotScreen = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);

  const handleSendMessage = async (messageText) => {
    if (messageText.trim().length === 0) return;
    const messageSent = await sendMessage(user.id, messageText);
    if (messageSent) {
      setMessages(prevMessages => [...prevMessages, { id: Date.now().toString(), userId: user.id, user: 'user', text: messageText, created_at: new Date() }]);
      setInput('');
      setIsTyping(true);

      const botResponse = await fetchGPTResponse(messageText);
      if (botResponse) {
        const botMessageSaved = await saveBotResponse(user.id, botResponse);
        if (botMessageSaved) {
          setMessages(prevMessages => [...prevMessages, { id: Date.now().toString(), userId: user.id, user: 'bot', text: botResponse, created_at: new Date() }]);
        }
      }

      setIsTyping(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setShowPrompts(false);
    handleSendMessage(prompt);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="ConnectIT bot" mb={30} />
      </View>
      <View style={styles.chatContainer}>
        {showPrompts && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsContainer}>
            {prompts.map((prompt, index) => (
              <TouchableOpacity key={index} style={styles.promptButton} onPress={() => handlePromptClick(prompt)}>
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
        />
        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.typingText}>ConnectIT bot est en train d'écrire...</Text>
          </View>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Tapez votre message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSendMessage(input)}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  chatListContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  chatListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chatList: {
    paddingBottom: hp(1),
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  chatItem: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    
  },
  chatItemText: {
    fontSize: 14,
    color: '#333',
  },
  newChatButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  newChatButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  promptsContainer: {
    marginVertical: 2,
    height:hp(20),
  },
  promptButton: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    height:hp(15),
    width:hp(30)
  },
  promptText: {
    color: '#333',
    fontSize: 14,
  },
  messageList: {
    paddingBottom: hp(1),
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  userMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCF8C6',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  botMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#ECECEC',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  userMessageText: {
    color: '#333',
  },
  botMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  typingText: {
    marginLeft: 10,
    fontStyle: 'italic',
    color: '#888',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
  botHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  botInfo: {
    marginRight: 10,
  },
  botName: {
    fontWeight: 'bold',
  },
});

export default ChatbotScreen;
