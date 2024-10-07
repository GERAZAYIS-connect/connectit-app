import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import SenderInput from '../../components/senderInput'
import { useRouter } from 'expo-router';


const ForumDetailScreen = ({ navigation }) => {
  const groupName = "Info L1 UY1";
  const groupLogo = null;
  const router=useRouter()
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Logo or First Letter */}
        <View style={styles.logoContainer}>
          {groupLogo ? (
            <Image source={{ uri: groupLogo }} style={styles.logo} />
          ) : (
            <View style={styles.initialsCircle}>
              <Text style={styles.initialsText}>{groupName.charAt(0)}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.groupInfo}>50 membres</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <MaterialIcons name="call" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <MaterialIcons name="videocam" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <MaterialIcons name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Section */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>7 Septembre 2024</Text>
        </View>

        {/* Exemple de message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Vous avez créé le groupe "Info L1 UY1"</Text>
        </View>

        {/* Autres messages */}
        {/* Ajouter d'autres messages ici */}
      </ScrollView>

      {/* Input Section */}
      <SenderInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE6EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#094385',
    paddingVertical: 15,
    paddingHorizontal: 15,

  },
  logoContainer: {
    marginLeft: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34B7F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTextContainer: {
    top:8,
    flex: 1,
    marginLeft: 10,
  },
  groupName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupInfo: {
    color: '#D3D3D3',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#DADADA',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
  },
  messageContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#4A4A4A',
  },
 
});

export default ForumDetailScreen;
