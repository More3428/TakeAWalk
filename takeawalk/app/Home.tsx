import { StyleSheet, View, Text, Pressable } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '@/FirebaseConfig';


interface RouterProps {
    navigation: NavigationProp<any, any>;
}


const Home = ({ navigation}: RouterProps) => {
  return (
    <View>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Walk')}><Text style={styles.text}>{"Start Walk"}</Text></Pressable> 
      <Pressable style={styles.button} onPress={() => FIREBASE_AUTH.signOut()}><Text style={styles.text}>{"Logout"}</Text></Pressable> 
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container:{
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'

    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#fdf5e6',
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
      }
});