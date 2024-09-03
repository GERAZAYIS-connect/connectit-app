import {  ScrollView,StyleSheet, Text, TouchableOpacity, View, Image, Pressable, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import {Header} from '../../components/Header'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/common'
import {useAuth} from '../../contexts/AuthContext'
import Avatar  from '../../components/avatar'
import { useLocalSearchParams, useRouter } from 'expo-router'
import RichTextEditor from '../../components/RichTextEditor'
import Icon from '../../assets/icons'
import Button from '../../components/button'
import * as ImagePicker from 'expo-image-picker'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import { creatorUpdatePost } from '../../services/postService'


const Newpost = () => {
  const {user}= useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [Loading, setLoading]=useState(false);
  const [file, setFile]=useState(file);
  const post =useLocalSearchParams();
  console.log('post',post);


  useEffect(()=>{
    if(post && post.id){
      bodyRef.current = post.body;
      setFile(post.file || null);
      setTimeout(()=>{
         editorRef?.current?.setContentHTML(post.body);
      }, 300)
     
    }
  },[])

  const onPick = async(isimage)=>{
    let mediaConfig={
     mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[4,4],
      quality: 0.7, 
    }
    if(!isimage){
      mediaConfig.mediaTypes= ImagePicker.MediaTypeOptions.Videos;
      allowsEditing: true;
    }
     let result = await ImagePicker.launchImageLibraryAsync( mediaConfig);

     if(!result.canceled){
      setFile(result.assets[0]);
     }
  }
  const isLocalFile=(file)=>{
    if(!file) return null;
    if(typeof file =='object')return true;
    return false;
  }
  getFileType=(file)=>{
    if(!file) return null;
    if(isLocalFile(file)){
      return file.type;
    }

    //verification si image ou video depuis le repertoire
    if(file.includes('postImage')){
      return 'image';
  }
  return 'video';

}

const getFileUri=(file)=>{
  if(!file) return null;
  if(isLocalFile(file)){
    return file.uri
  }
  return getSupabaseFileUrl(file)?.uri;
}
  const onsubmit = async()=>{
    if(!bodyRef.current && !file){
      Alert.alert('Post','Veuillez ajouter un contenue(texte/image) à votre post');
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id
    }

    if (post && post.id) data.id=post.id;

    setLoading(true);
    let res = await creatorUpdatePost(data);
    setLoading(false);
    if(res.success){
      setFile(null);
      bodyRef.current="";
      editorRef.current?.setContentHTML('');
      router.back();
    }else{
      Alert.alert('Post', res.msg);
    }
  }
  //console.log('image uir',getFileUri(file))
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="nouveau post"/>
        <ScrollView contentContainerStyle={{gap:20}}>
          <View style={styles.header}>
            <Avatar 
            uri={user?.image}
            size={hp(6.5)}
            rounded={theme.radius.xl}
            />
            <View style={{gap:2}}>
              <Text style={styles.userName}>
                {
                  user && user.name
                }
              </Text>
              <Text style={styles.publicText}>
                IT-Publisher
              </Text>
            </View>
          </View>

          <View style={styles.textEditor}>
            <RichTextEditor editorRef={editorRef} onChange={body=>bodyRef.current =body }/>
          </View>
          { 
            file && (
              <View style={styles.file}>
                {
                  getFileType(file)=='video'?(
                  <Video
                  style={{flex:1}}
                  source={{
                    uri:getFileUri(file)
                  }}
                  useNativeControls
                  resizeMode='cover'
                  isLooping
                  />
                  ):(
                    <Image source={{uri:getFileUri(file)}} resizeMode='cover' style={{flex:1}}/>
                  )
                }
                <Pressable style={styles.closeIcon} onPress={()=>setFile(null)}>
                  <Icon name="delete" size={25} color="white"></Icon>
                </Pressable>
              </View>
            )
          }

          <View style={styles.media}>
                <Text style={styles.addImageText}>Ajouter à votre post </Text>
                <View style={styles.mediaIcons}>
                  <TouchableOpacity onPress={()=>onPick(true)}>
                    <Icon name="image" size={hp(4)} color={theme.colors.dark}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>onPick(false)}>
                    <Icon name="video" size={hp(4)} color={theme.colors.dark}/>
                  </TouchableOpacity>
                </View>
          </View>
        </ScrollView>
        <Button 
        buttonStyle={{height:hp(6,5)}}
        title={post && post.id? "mettre à jour":"post"}
        loading={Loading}
        hasShadow={false}
        onPress={()=>onsubmit()}/>
      </View>
    </ScreenWrapper>
  )
}

export default Newpost

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginBottom:30,
    paddingHorizontal:wp(4),
    gap:15
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    gap:12
  },
  title:{
    marginBottom:10,
    fontSize:hp(2.4),
    fontWeight:theme.fonts.semibold,
    color: theme.colors.text,
    textAlign:'center'
  },
  userName:{
    fontSize:hp(2.2),
    fontWeight:theme.fonts.semibold,
    color:theme.colors.text
  },
  Avatar:{
    height:hp(6.5),
    width:hp(6.5),
    borderRadius:theme.radius.xl,
    borderCurve:'continuous',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.1)'
  },
  publicText:{
    fontSize:hp(1.7),
    fontWeight:theme.fonts.medium,
    color:theme.colors.textLight
  }, 
  textEditor:{
    marginTop: 10,
  },

  media:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderWidth:1.5,
    padding:12,
    paddingHorizontal:18,
    borderRadius:theme.radius.xl,
    borderCurve:'continuous',
    borderColor:'#ccc',
  },
  imageIcon:{
    backgroundColor:'#ccc',
    borderRadius: theme.radius.md,
    padding:6,
   },
  file:{
    height:hp(30),
    width:'100%',
    borderRadius:theme.radius.xl,
    overflow:'hidden',
    borderCurve:'continuous',
    borderColor:theme.colors.gray
  },
  mediaIcons:{
    flexDirection:'row',
    gap:15,
    alignItems:'center'
  },

  addImageText:{
    fontSize:hp(1.9),
    fontWeight:theme.fonts.semibold,
    color: theme.colors.text
  },
  video:{

  },
  closeIcon:{
    borderRadius:50,
    position: 'absolute',
    top:10,
    right:5,
    padding:5,
    backgroundColor:'rgba(255,0,0,0.7)',
    //shadowColor: theme.colors.textDark,
    //shadowOffset: {width: 0, height:3},
    //shadowOpacity:0.9,
    //shadowRadius:8
  }
})