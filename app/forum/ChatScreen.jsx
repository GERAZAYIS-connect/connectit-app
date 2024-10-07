import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { wp, hp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import SenderInput from '../../components/senderInput';
import ForumNavbar from '../../components/ForumNavbar';
// Données fictives pour les conversations
const conversations = [
  {
    id: '1',
    name: 'John Doe',
    image: null,
    messages: [
      { sender: 'user', text: 'Salut John, comment ça va ?' },
      { sender: 'John Doe', text: 'Salut ! Je vais bien, et toi ?' },
      { sender: 'user', text: 'Je vais bien, merci ! Tu as vu la nouvelle fonctionnalité du forum ?' },
      { sender: 'John Doe', text: 'Oui, c’est génial, j’aime bien.' },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    image: null,
    messages: [
      { sender: 'user', text: 'Bonjour Jane, comment se passe ton projet ?' },
      { sender: 'Jane Smith', text: 'Salut ! Ça avance plutôt bien, merci.' },
      { sender: 'user', text: 'Super ! Fais-moi signe si tu as besoin d’aide.' },
      { sender: 'Jane Smith', text: 'Je n’hésiterai pas, merci beaucoup.' },
    ],
  },
  {
    id: '3',
    name: 'Alice Johnson',
    image: null,
    messages: [
      { sender: 'user', text: 'Hello Alice, tu viens demain à la réunion ?' },
      { sender: 'Alice Johnson', text: 'Salut ! Oui, je serai là.' },
      { sender: 'user', text: 'Génial ! À demain alors.' },
      { sender: 'Alice Johnson', text: 'À demain !' },
    ],
  },
  {
    id: '4',
    name: 'Bob Williams',
    image: null,
    messages: [
      { sender: 'user', text: 'Hey Bob, tu es prêt pour le démarrage du projet ?' },
      { sender: 'Bob Williams', text: 'Salut ! Oui, je suis prêt. On commence quand ?' },
      { sender: 'user', text: 'On peut commencer lundi.' },
      { sender: 'Bob Williams', text: 'Ça marche pour moi.' },
    ],
  },
];



const ChatScreen = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollViewRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (typing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [typing]);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setTyping(false);
  };

  const handleSendMessage = () => {
    if (selectedConversation) {
      // Logique d'envoi de message ici
      setMessage('');
      setTyping(true); // Simule que le bot tape un message
    }
  };

  const renderBubble = ({ item }) => (
    <View style={styles.bubbleWrapper}>
      <TouchableOpacity
        style={[
          styles.bubble,
          selectedConversation && selectedConversation.id === item.id && styles.activeBubble
        ]}
        onPress={() => item.id === 'new' ? alert('Start a new conversation') : handleConversationSelect(item)}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.bubbleImage} />
        ) : (
          <Text style={styles.bubbleText}>
            {item.name.charAt(0)}
          </Text>
        )}
      </TouchableOpacity>
      <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
    </View>
  );

  const renderMessage = ({ item, index }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userMessage : styles.otherMessage
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Liste des discussions dans l'entête */}
      <FlatList
        horizontal
        data={[{ id: 'new', name: '+ New', image: null }, ...conversations]}
        keyExtractor={(item) => item.id}
        renderItem={renderBubble}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bubbleContainer}
      />

      {/* Zone de conversation */}
      {selectedConversation ? (
        <>
          <FlatList
            ref={scrollViewRef}
            data={selectedConversation.messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.messageContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          />
          {typing && (
            <Animated.View style={[styles.typingIndicator, { opacity: typingAnimation }]}>
              <Text style={styles.typingText}>{selectedConversation.name} is typing...</Text>
            </Animated.View>
          )}
        </>
      ) : (
        <Text style={styles.noConversationText}>
          Select a conversation to start chatting.
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity
          style={[styles.sendButton, { opacity: selectedConversation ? 1 : 0.5 }]}
          onPress={handleSendMessage}
          disabled={!selectedConversation}
        >
          <Icon name="send" size={wp(5)} color="#fff" />
        </TouchableOpacity>
      </View>
      <ForumNavbar/>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
    paddingHorizontal: wp(2),
    paddingTop: hp(3),
  },
  bubbleContainer: {
    backgroundColor: 'rgba(0,0,255,0.09)',
    paddingVertical: hp(2),
    height: hp(15),
    marginBottom: hp(2),
  },
  bubbleWrapper: {
    alignItems: 'center',
    marginRight: wp(3),
    width: wp(18),
  },
  bubble: {
    width: wp(15),
    height: wp(15),
    backgroundColor: theme.colors.light,
    borderRadius: wp(7.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
    borderWidth: 2,
    borderColor: theme.colors.primaryDark,
  },
  activeBubble: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  bubbleText: {
    fontSize: wp(6),
    color: theme.colors.text,
    fontWeight: '600',
  },
  bubbleImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(7.5),
  },
  userName: {
    fontSize: wp(3),
    color: theme.colors.text,
    textAlign: 'center',
    width: '100%',
  },
  messageContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(3),
  },
  conversationTitle: {
    fontSize: wp(4),
    alignSelf:'center',
    fontWeight: 'italic',
    marginBottom: hp(2),
    color: theme.colors.primary,
    paddingHorizontal: wp(3),
  },
  messageBubble: {
    borderRadius: wp(4),
    padding: wp(3),
    marginBottom: hp(1),
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: theme.colors.primaryDark,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: wp(4),
    color: 'white',
  },
  messageTime: {
    fontSize: wp(3),
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
    marginTop: hp(0.5),
  },
  typingIndicator: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  typingText: {
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  noConversationText: {
    fontSize: wp(4),
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: hp(5),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    backgroundColor: theme.colors.light,
  },
  input: {
    flex: 1,
    fontSize: wp(4),
    padding: wp(3),
    backgroundColor: 'white',
    borderRadius: wp(5),
    marginRight: wp(2),
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  sendButton: {
    width: wp(12),
    height: wp(12),
    backgroundColor: theme.colors.primary,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
