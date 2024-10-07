import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { wp, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import { useRouter } from 'expo-router';

const ForumNavbar = ({ activeScreen }) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  
  const navItems = [
    { name: 'home', icon: 'home', label: 'Accueil', route: '(main)/home' },
    { name: 'chat', icon: 'chat', label: 'Chat', route: 'forum/ChatScreen' },
    { name: 'notifications', icon: 'notifications', label: 'Notifs', route: '(main)/notifications' },
    { name: 'settings', icon: 'settings', label: 'Réglages', route: '(main)/settings' },
  ];

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={handleToggle}>
        <MaterialIcons name="add" size={28} color='white' />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.navbar}>
          {navItems.map((item) => (
            <TouchableOpacity 
              key={item.name}
              onPress={() => router.push(item.route)}
              style={styles.navItem}
            >
              <View style={[
                styles.iconContainer,
                activeScreen === item.name && styles.activeIconContainer
              ]}>
                <MaterialIcons 
                  name={item.icon} 
                  size={24} 
                  color={activeScreen === item.name ? theme.colors.white : theme.colors.textLight} 
                />
              </View>
              <Text style={[
                styles.navLabel,
                activeScreen === item.name && styles.activeNavLabel
              ]}>
                {item.label}
              </Text>
              {activeScreen === item.name && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
  },
  toggleButton: {
    width: wp(15),
    height: wp(15),
    backgroundColor: theme.colors.primary,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navbar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(2.5),
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    borderBottomEndRadius: wp(5),
    borderBottomStartRadius: wp(5),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(1),
  },
  iconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  activeIconContainer: {
    backgroundColor: theme.colors.primary,
  },
  navLabel: {
    fontSize: wp(3),
    color: theme.colors.textLight,
  },
  activeNavLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  activeIndicator: {
    width: wp(1.5),
    height: wp(1.5),
    backgroundColor: theme.colors.primary,
    borderRadius: wp(0.75),
    position: 'absolute',
    bottom: -hp(1),
  },
});

export default ForumNavbar;
