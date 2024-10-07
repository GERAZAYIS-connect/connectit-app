import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { wp, hp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ForumNavbar from '../../components/ForumNavbar';

const ForumHomeScreen = () => {
  const router = useRouter();
  const [activeScreen, setActiveScreen] = useState('home');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleNavigate = (screen) => {
    setActiveScreen(screen);
    console.log(`Navigating to ${screen}`);
  };

  const forums = [
    { id: 1, title: 'Mathématiques Licence 1', members: 1200, color: 'red', unreadMessages: 5 },
    { id: 2, title: 'Physique Licence 2', members: 800, color: 'green', unreadMessages: 2 },
    { id: 3, title: 'Chimie Licence 3', members: 950, color: 'blue', unreadMessages: 0 },
    { id: 4, title: 'Biologie Master 1', members: 600, color: 'purple', unreadMessages: 8 },
  ];

  const renderForumItem = ({ item }) => (
    <TouchableOpacity
      style={viewMode === 'grid' ? styles.gridItem : styles.listItem}
      onPress={() => router.push('./ForumDetailScreen')}
    >
      <View style={styles.forumIcon}>
        <MaterialIcons name="forum" size={28} color={item.color} />
      </View>
      <View style={styles.forumContent}>
        <Text style={styles.forumTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.forumMembers}>{item.members} membres</Text>
        {item.unreadMessages > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadMessages}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
        <Text style={styles.title}>Universite de Yaounde 1</Text>
        <Text style={styles.facultyName}>Faculté des Sciences</Text>
        </View>
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
          <MaterialIcons 
            name={viewMode === 'grid' ? 'view-list' : 'grid-view'} 
            size={24} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={forums}
        renderItem={renderForumItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // This forces a re-render when switching views
        contentContainerStyle={styles.forumList}
      />

      <ForumNavbar activeScreen={activeScreen} onNavigate={handleNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: wp(3),
    paddingTop: hp(3),
},
 header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  
  title: {
    fontSize: wp(5),
    fontWeight: 'normal',
    color: theme.colors.primary,
  },
    facultyName: {
    fontSize: wp(4),
    color: theme.colors.text,
  },
  forumList: {
    paddingVertical: hp(2),
  },
  gridItem: {
    flex: 1,
    margin: wp(1),
    backgroundColor: theme.colors.cardBackground,
    padding: wp(3),
    borderRadius: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    elevation: 3,
    aspectRatio: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    padding: wp(4),
    marginBottom: hp(2),
    borderRadius: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    elevation: 3,
  },
  forumIcon: {
    marginBottom: hp(1),
  },
  forumContent: {
    flex: 1,
  },
  forumTitle: {
    fontSize: wp(3.5),
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: hp(0.5),
  },
  forumMembers: {
    fontSize: wp(3),
    color: theme.colors.textLight,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: wp(2),
    padding: wp(1),
    minWidth: wp(5),
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: wp(2.5),
    fontWeight: 'bold',
  },
});

export default ForumHomeScreen;