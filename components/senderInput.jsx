import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { theme } from '../constants/theme'

const SenderInput = () => {
  return (
      <View style={styles.inputContainer}>
        <FontAwesome name="smile-o" size={28} color="gray" style={styles.inputIcon} />
        <TextInput style={styles.input} placeholder="Message" />
        <FontAwesome name="paperclip" size={28} color="gray" style={styles.inputIcon} />
        <TouchableOpacity>
        <FontAwesome name="camera" size={28} color="gray" style={styles.inputIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="microphone" size={28} color="gray" style={styles.inputIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="send" size={28} color={theme.colors.primary} style={styles.inputIcon} />
        </TouchableOpacity>
        
        </View>
  )
}

export default SenderInput

const styles = StyleSheet.create({
     inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#ECE5DD',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#094385',
  },
  inputIcon: {
    marginHorizontal: 5,
  },
})