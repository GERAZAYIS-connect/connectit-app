import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { theme } from '../constants/theme'
import { hp,stripHtmlTags,wp } from '../helpers/common'
import Avatar from './avatar'
import moment from 'moment'
import Icon from '../assets/icons/index'
import RenderHtml from 'react-native-render-html';
import { Image } from 'expo-image'
import { downloadFile, getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'
import { createPostLike, removePostLike } from '../services/postService'
import Loading from './loading'
import { LogBox } from 'react-native';



const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow=true,
    showMoreIcon=true,
    showDelete=false,
    showsDelete = false,
    onDelete = ()=>{},
    onEdit=()=>{}

}) => {
    LogBox.ignoreLogs([
  'Warning: TRenderEngineProvider: Support for defaultProps will be removed from function components in a future major release.',
  'Warning: MemoizedTNodeRenderer: Support for defaultProps will be removed from memo components in a future major release.',
  'Warning: TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release.',
]);
    const [loading, setLoading]=useState(false)
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);
    const shadowStyles={
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.06,
        shadowRaduis:6,
        elevation:1
    }
    const onShare=async ()=>{
        let content= {message: stripHtmlTags(item?.body) };
        if(item?.file){
            setLoading(true);
            let url= await downloadFile(getSupabaseFileUrl( item?.file).uri);
            setLoading(false);
            content.url= url;
        }
        Share.share(content);
    }


const onLike = async () => {
    if (liked) {
        let updatedLikes = likes.filter(like => like.userId != currentUser?.id);
        setLikes(updatedLikes);
        setLiked(false);
        let res = removePostLike(item?.id, currentUser?.id);
        if (!res.success) {
            Alert.alert('Post', 'Impossible de retirer le like.');
        }
    } else {
        let data = {
            userId: currentUser?.id,
            postId: item?.id,
        };
        setLikes([...likes, data]);
        setLiked(true);
        let res = await createPostLike(data);
        if (!res.success) {
            Alert.alert('Post', 'Impossible d\'ajouter le like.');
        }
    }
};

useEffect(() => {
    setLikes(item?.postLikes || []);
    setLiked(item?.postLikes?.some(like => like.userId === currentUser?.id));
}, [item?.postLikes, currentUser?.id]);
    useEffect(() => {
        setLiked(item?.postLikes);
    }, [])

    const openPostDetails=()=>{
        if(!showMoreIcon)return null;
        router.push({pathname:'postDetails', params:{postId:item?.id}})
    }

    const handlePostDelete=()=>{
        Alert.alert("confirmer","supprimer le Post?", [{
            text:'non',
            onPress:()=>console.log('modal canceled'),
            style:'cancel'
    },
    {
            text: 'oui',
            onPress: () =>onDelete(item),
            style: 'destructive'
    }])
    }

    const createdAt = moment(item?.created_at).format('D MMMM')
    const createdAttime = moment(item?.created_at).format('hh:mm')

  return (
    <View style={[styles.container, hasShadow && shadowStyles] }>
      <View style={[styles.header]}> 
            <View style={styles.userInfo}>
                <Avatar
                size={hp(4.5)}
                uri={item?.user?.image}
                rounded={theme.radius.md}
                />
                <View style={{gap:2}}>
                    <Text style={styles.userName}>
                        {item?.user?.name}
                    </Text>
                    <Text style={styles.postTime}>
                        {createdAt} à {createdAttime}
                    </Text>
                </View>
            </View>
            <View>
                {
                    showMoreIcon && (
                    <TouchableOpacity onPress={openPostDetails}>
                        <Icon name="threeDotsHorizontal" size={hp(3.4)}  strokeWidth={3} color={theme.colors.text}/>
                    </TouchableOpacity>    
                    )
                }
                
                {
                    showDelete && currentUser.id == item?.userId &&(
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={()=>onEdit(item)}>
                                <Icon name="edit" size={hp(2.5)} color={theme.colors.text}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePostDelete}>
                                <Icon name="delete" size={hp(2.5)} color='red'/>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
      </View>
      <View style={styles.content}>
        <View style={styles.postBody}>
                {
                    item?.body && (
                        <RenderHtml
                        contentWidth={wp(100)}
                        source={{html: item?.body}}
                        
                        />
                    )
                }
        </View>
        {
            item?.file && item?.file?.includes('PostImage') && (
                <Image 
                source={getSupabaseFileUrl(item?.file)}
                transition={100}
                style={styles.postmedia}
                contentFit='cover'
                />
            )
        }
        {
            item?.file && item?.file?.includes('PostVideo') && (
                <Video
                source={getSupabaseFileUrl(item?.file)}
                useNativeControls
                style={[styles.postmedia,{height:hp(30)}]}
                resizeMode='cover'
                isLooping
                />
            )
        }

      </View>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
            <TouchableOpacity onPress={onLike}>
                <Icon name="heart" size={hp(2.5)} fill={liked? theme.colors.blue:'transparent'} color={liked? theme.colors.blue : theme.colors.textLight}/>
            </TouchableOpacity>
            <Text style={styles.count}>
                {likes?.length}
            </Text>
            
        </View>
        <View style={styles.footerButton}>
            
            <TouchableOpacity onPress={openPostDetails}>
                <Icon name="comment" size={hp(2.5)} color={theme.colors.blue}/>
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                    item?.comments[0]?.count
                }
            </Text>
        </View>
        <View style={styles.footerButton}>
            {
                loading? (
                <Loading size="small"/>
            ):(
                <TouchableOpacity onPress={onShare}>
                <Icon name="share" size={hp(2.5)} color={theme.colors.blue}/>
            </TouchableOpacity>
                )
            }
            
        </View>
      </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container:{
        flex:1,
        gap:7,
        marginBottom:15,
        borderRadius:theme.radius.xxl*1.1,
        borderCurve:'continue',
        paddingVertical:12,
        backgroundColor:'white',
        borderWidth:0.6,
        borderColor: '#ccc',
        shadowColor:'#000',
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        right:10
    },
    userInfo:{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
        left:20
    },
    userName:{
        fontSize:hp(1.7),
        color:theme.colors.textDark,
        fontWeight:theme.fonts.medium
    },
    postTime:{
        fontSize:hp(1.4),
        color:theme.colors.textLight,
        fontWeight:theme.fonts.medium
    },
    content:{
        gap:10,
        marginLeft:10,
        marginRight:10
    },
    postmedia:{
        height:hp(40),
        width:'100%',
        borderRadius:theme.radius.xl,
        borderCurve:'continuous'
    },
    postBody:{
        marginLeft:5
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
        gap:18,
        marginLeft:10
    },
    footerButton:{
        marginLeft:5,
        flexDirection:'row',
        alignItems:'center',
        gap:4
    },
    actions:{
        flexDirection:'row',
        alignItems:'center',
        gap:18,
    },
    count:{
        color:theme.colors.text,
        fontsize:hp(1.8)
    }
})