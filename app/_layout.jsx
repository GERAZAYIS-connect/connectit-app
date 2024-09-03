import { LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getUserData, setUserData } from '../services/userService';

const _layout = () => {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    );
}

LogBox.ignoreLogs(['Warning:TNodeChildrenRenderer','Warning: MemorizedNodeRenderer','Warning:TRenderEngineProvider'])

const MainLayout = () => {
    const { setAuth, setUserData} = useAuth();
    const router = useRouter();

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            
            if (session) { 
                setAuth(session?.user);
                updateUserData(session?.user, session?.user?.email);  
                router.replace('/(main)/home');
            } else {
                setAuth(null);
                router.replace('/welcome');
            }
        })
        return;
    },[]);

    const updateUserData = async (user, email) => {
        let res = await getUserData(user?.id);
        //console.log('user data:', res);
        if(res.success){
            setUserData({...res.data, email});
        }
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        > 
            <Stack.Screen
            name="(main)/postDetails"
            options={{
                presentation:'modal'
            }}/>
      
        </Stack>
    );
}

export default _layout;
