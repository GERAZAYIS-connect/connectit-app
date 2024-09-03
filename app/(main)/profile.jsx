import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Header } from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import Icon from '../../assets/icons';
import { supabase } from '../../lib/supabase';
import Avatar from '../../components/avatar';
import { fetchPost } from '../../services/postService';
import PostCard from '../../components/PostCard';
import Loading from '../../components/loading';

var limit =0;
const Profile = () => {
    const {user,setAuth} = useAuth();
    const router = useRouter();

    const [post,setPost]=useState([]);
    const [hasMore,setHasMore]=useState(true);

    const onLogout = async () => {
    setAuth(null);
    const {error} = await supabase.auth.signOut();

    if (error){
        Alert.alert('deconnexion', ' erreur de deconnexion😂');
    }
    }

    const getPost = async () => {
    if(!hasMore) return null;
    limit=limit+10;
    //appel de l'api pour recuperer les post
    console.log('fetching Poost: ',limit);
     let res= await fetchPost(limit, user.id);
    if(res.success){
      if(post.length==res.data.length) setHasMore(false);
      setPost(res.data);
    }
  }

    const handleLogout= async()=>{
        Alert.alert("confirmer","Voulez vous vraiment vous deconnecter?", [{
            text:'Retour',
            onPress:()=>console.log('modal canceled'),
            style:'cancel'
    },
    {
            text: 'Déconnexion',
            onPress: () =>onLogout(),
            style: 'destructive'
    }])
    }
    return (
        
        <ScreenWrapper bg='white'>
            

            <FlatList
            data={post}
            ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout}/>}
            ListHeaderComponentStyle={{marginBottom:30}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.liststyle}
            keyExtractor={item=>item.id.toString()}
            renderItem={({item})=><PostCard
            item={item}
            currentUser={user}
            router={router}
            />  
          } 
          onEndReached={()=>{
            getPost();
            console.log('go to the ends')
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={hasMore?(
            <View style={{marginVertical:post.length==0? 100:30}}>  
              <Loading />
            </View>
          ):(<View style={{marginVertical:post.length==0? 200:30}}> 
            <Text style={styles.noPost}>Vous avez consulté(e) tous les Posts</Text>
            </View>)}
          
        />
        </ScreenWrapper>
    );
};

const UserHeader =({ user, router,handleLogout })=> {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
            <View>
                <Header title="Profile" mb={30}/>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="logout" color='red'></Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={{gap:10}}>
                    <View style={styles.avatarContainer}>
                        <Avatar 
                        uri={user?.image}
                        size={hp(12)}
                        rounded={theme.radius.xxl}
                        style={{borderWidth: 2}}  
                        />
                        <Pressable style={styles.editIcon} onPress={()=>router.push('./editProfile')}>
                         <Icon name="edit" strockewidth={2.5} size= {20}/>
                        </Pressable>
                    </View>
                    < View style={{alignItems:'center', gap:4}}>
                        <Text style={styles.userName}>
                            {user && user?.name} 
                        </Text>
                        <Text style={styles.infoText}>
                            {user && user?.adress}
                        </Text>
                    </View>
                    <View style={{gap:10}}>
                        <View style={styles.info}>
                            <Icon name='mail' size={20} color={theme.colors.dark} />
                            <Text style={styles.infoText}>
                            {user && user.email}
                        </Text>
                        </View>
                        {
                            user && user.phonenumber &&(
                                <View style={styles.info}>
                            <Icon name='call' size={20} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>
                            {user && user.phonenumber}
                        </Text>
                        </View>
                            )
                        }
                        {
                            user && user.bio && (
                                <View style={styles.info}>
                            <Icon name='threeDotsHorizontal' size={20} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>
                            {user && user.bio}
                        </Text>
                        </View>
                            )
                        }
                    </View>
                </View>
            </View>
        </View>
    );
};
export default Profile;

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    heaContainer:{
        marginHorizontal:wp(4),
        marginEnd:20
    },
    headerShape:{
        width: wp(100),
        height:hp(20)
    },
    avatarContainer:{   
        width: hp(12),
        height:hp(12),
        alignSelf:'center'
    },
    editIcon:{
        position: 'absolute',
        bottom: 0,
        right:-12,
        padding: 7,
        borderRadius:50,
        backgroundColor:'white',
        shadowColor:theme.colors.textLight,
        shadowOffset: {width: 0, height:4},
        shadowOpacity:0.4,
        shadowRadius:5,
        elevation:7
    },
    
    userName:{
        fontSize:hp(3),
        color:theme.colors.blue
    },
    info:{
        flexDirection: "row",
        alignItems:'center',
        gap:10
    },
    infoText:{
        fontSize:hp(1.6),
        color:theme.colors.textLight,
        gap:4,
    },
    logoutButton:{
        position:'absolute',
        right:0.8,
        padding:5,
        borderRadius:theme.radius.sm,
        backgroundColor:'#fee2e2'
    },
    listStyle:{
        paddingHorizontal: hp(4),
        paddingBottom:30
    },
    noPost:{
        fontSize:hp(2),
        textAlign:'center',
        color:theme.colors.text
    }
});
