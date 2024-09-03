import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import Avatar from '../components/avatar'
import moment from 'moment'
import format from 'pretty-format'
import { usePathname } from 'expo-router'

const NotificationItem = ({
    item,
    router,
    
}) => {
    handleclick =async ()=>{
        //detail du post
        let {postId, commentId}=JSON.parse(item?.data)
        router.push({pathname:'postDetails', params: {postId,commentId}})
    }
    
    const createdAt= moment(item?.created_at).format('d MMM')
    const heure= moment(item?.created_at).format('HH:MM')
  return (
    <TouchableOpacity style={styles.container} onPress={handleclick}>
      <Avatar 
      uri={item?.sender?.image}
      size={hp(5)}
      />
      <View style={styles.nameTitle}>
        <Text style={styles.text}>
            {
                item?.sender?.name
            }
        </Text>
        <Text style={[styles.text, {color:theme.colors.textDark}]}>
            {
                item?.title
            }
        </Text>
      </View>
      <Text style={[styles.text, {color:theme.colors.textDark}]}>
            {
                createdAt 
            }<Text> à </Text> { heure}
        </Text>
    </TouchableOpacity>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
     container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        gap:12,
        backgroundColor:'white',
        borderWidth:0.5,
        borderColor:theme.colors.darkLight,
        borderRadius:theme.radius.xxl,
        borderCurve:'continuous',    
        shadowColor:'#000',
        padding:15,
    },
    nameTitle:{
        flex:1,
        gap:2,
    },
    text:{
    fontSize:hp(1.6),
    color:theme.colors.textDark,
    fontWeight:theme.fonts.medium
    }
})