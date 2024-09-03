import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchnotification } from '../../services/notificationService'
import { useRouter } from 'expo-router'
import ScreenWrapper from '../../components/ScreenWrapper'
import NotificationItem from '../../components/notificationItem'
import { Header } from '../../components/Header'

const Notifications = () => {
  const [notification, setNotification]=useState([])
  const {user}= useAuth();
  const router = useRouter();

useEffect(()=>{
  getNotification();

},[]);

const getNotification = async ()=>{
  let res = await fetchnotification(user.id);
  if(res.success) setNotification(res.data)
}
  return (
    <View style={styles.container}>
      <Header title="Notifications"/>
      {/**<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.liststyle}>*/}
      <ScreenWrapper>
        {
          notification.map( item=>{
            return(
              <NotificationItem
              item={item}
              key={item?.id}
              router ={router}
              />
            )
          })

        }
        {
          notification.length == 0 && (
            <Text> aucune notification </Text>
          )
        }
        </ScreenWrapper>
     {/**</ScrollView>*/}
      
    </View>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container:{
        flex:0.30,
        gap:7,
    }})