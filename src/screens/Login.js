import React, { Component } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage} from 'react-native'
import {Item, Input, Label} from 'native-base'
import axios from 'axios'
import {Navigation} from 'react-native-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const GLOBALS = require('../Globals')

const url = GLOBALS.API_URL

export default class Login extends Component{

  constructor(props){
    super(props)
    this.state = {
      inputEmail:"",
      inputPassword:"",
      passwordShow:true
    }
  }

  componentDidMount(){
    this.clear()
  }

  async clear(){
    try{
      await AsyncStorage.removeItem('@token')
    }catch(err){
    }
  }

  login(){
    if(this.state.inputEmail=="" && this.state.inputPassword==""){
      alert('Email dan Password tidak boleh kosong')
    }else if(this.state.inputEmail!="" && this.state.inputPassword==""){
      alert('Password tidak boleh kosong')
    }else if(this.state.inputEmail=="" && this.state.inputPassword!=""){
      alert('Email tidak boleh kosong')
    }else{
      axios.post(`${url}/signIn`, {
        email:this.state.inputEmail,
        password:this.state.inputPassword
        
      }).then((res) => {
        
        AsyncStorage.setItem('@token', res.data.token).then((res) => {
          this.goToHome() 
        })
      }).catch((err) => alert(err.response.data.msg))
    }
      
  }

  changePasswordVisible(){
    this.setState({passwordShow: !this.state.passwordShow})
  }

  goToHome(){
    Navigation.setRoot({
      root: {
        component: {
          name: "main"
        }
      }
    });
  }

  render(){
    return(
      <View style={styles.main}>
        <View style={styles.container}>
          <Text style={styles.logo}>Simple-Chat</Text>
          <Item style={styles.wrapper}>
            <Input placeholder="email" placeholderTextColor="#AAA" value={this.state.inputEmail} onChangeText={(value) => this.setState({inputEmail: value})} />
          </Item>
          <Item style={styles.wrapper}>
            <Input placeholder="password" placeholderTextColor="#AAA" secureTextEntry={this.state.passwordShow}  value={this.state.inputPassword} onChangeText={(value) => this.setState({inputPassword: value})} />
            <TouchableOpacity onPress={() => this.changePasswordVisible()}>
                {this.state.passwordShow ? (<MaterialIcons name="visibility-off" size={20} color="#000"/>) : (<MaterialIcons name="visibility" size={20} color="#000"/>)}
            </TouchableOpacity>
          </Item>
          <TouchableOpacity onPress={()=> this.login()} >
            <View style={[styles.wrapper, styles.btnLogin]}>
              <Text style={styles.btnText}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main:{
    flex:1
  },
  container: {
    justifyContent:"center",
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  logo:{
    fontSize:50,
    marginTop:-100,
    alignSelf: 'center',
  },
  wrapper:{
    width:"90%",
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop:10
  },
  btnLogin:{
    backgroundColor:"#3A3",
    paddingVertical: 10,
    borderRadius: 5,
  },
  btnText:{
    fontSize:20,
    alignSelf: 'center',
    color:"#FFF"
  }
})
