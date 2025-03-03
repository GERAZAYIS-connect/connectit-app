import {
    StyleSheet,
    Button,
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    ScrollView,
    SafeAreaView,
    Alert
} from "react-native";
import React, {useRef, useState} from "react";
import Icon from "../assets/icons/index";
import {theme} from "../constants/theme";
import { StatusBar } from 'expo-status-bar';
import ScreenWrapper from "../components/ScreenWrapper";
import {useRouter} from 'expo-router';
import Backbutton from "../components/BackButton";
import {hp, wp} from "../helpers/common";
import Input from "../components/input";
import CustomButton from "../components/button";
import {supabase} from "../lib/supabase"; 
import Loading from "../components/loading";



const login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(true);

    const submit =async () => {
        if(!emailRef.current || !passwordRef.current){
            alert('Connexion',"Veuillez remplir tous les champs!");
            return;
        }
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();
        setLoading(true);

        const {error}=await supabase.auth.signInWithPassword({
            email,
            password
        });
        console.log('error:',error);
        if(error){
            Alert.alert('Connexion',error.message);}
    }
    return(
        <ScreenWrapper bg="white">
           <StatusBar style="dark" />
            <View style={styles.container}>
                <Backbutton router={router}/>
                <View>
                    <Text style={styles.WelcomeTextHead}>G-Connect IT</Text>
                </View>
                <SafeAreaView style={styles.containerSafe}>
                    <ScrollView style={styles.scrollView} Vertical showsVerticalScrollIndicator={false}>
                        <View>
                            <Image
                                style={styles.WelcomeImage} resizeMode='contain' source={require('../assets/images/welcome1.jpg')}/>
                        </View>
                <View>
                    <Text style={styles.WelcomeText}>Heureux de vous revoir!!!</Text>
                    <Text style={{fontSize:hp(1.5), color:theme.colors.text, textAlign:'center'}}>connecter vous pour continuer svp!</Text>
                </View>
                <View style={styles.form}>
                    < Input
                        icon={<Icon name="mail" size="26" strokeWidth={1.6} />}
                        placeholder ="Votre mail"
                        onChangeText={value=>emailRef.current=value}
                    />
                    < Input
                        icon={<Icon name="lock" size="26" strokeWidth={1.6} />}
                        placeholder ="Votre Mot de passe"
                        secureTextEntry={true}
                        onChangeText={value=>passwordRef.current=value}
                    />
                    <Text style={styles.forgotPassword}>
                        mot de passe oublié?
                    </Text>

                    <CustomButton
                        title="Se connecter"
                        lording={Loading}
                        onPress={submit}/>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Vous n'avez pas de compte?</Text>
                        <Pressable onPress={()=>router.push('signUp')}>
                            <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>S'inscrire</Text>
                        </Pressable>
                    </View>
                </View>
        </ScrollView>
</SafeAreaView>
            </View>
        </ScreenWrapper>
    )
}

export default login

const styles = StyleSheet.create({
    button:{
        alignSelf:'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        borderColor: "rgba(0,0,0,0.4)"
    },
    container: {
        flex: 1,
        gap: 5,
        marginHorizontal: wp(4),
    },
    containerSafe: {
        flex: 1,
        paddingTop: wp(4),
        paddingBottom:12
    },
    scrollView:{
        backgroundColor:'ping',

    },
    WelcomeText: {
        height: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.blue,
        textAlign:"center",
        fontSize: theme.radius.xl,
    },
    WelcomeTextHead: {
        height: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.blue,
        textAlign:"right",
        top:-25,
        fontSize: theme.radius.xl,
        marginLeft:55
    },
    form: {
        gap:15,
    },
    forgotPassword: {
        color: theme.colors.primary,
        fontWeight: theme.fonts.semibold,
        textAlign: 'right'
    },
    footerText:{
        color: theme.fonts.text,
        textAlign: 'center',
        fontSize: hp(1.6)
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 5

    },
    WelcomeImage: {
        width: wp(90),
        height: hp(30),
        alignSelf: 'center',

    }
})