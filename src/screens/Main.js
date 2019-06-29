import React, { Component } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage, FlatList, TouchableHighlight, Alert} from 'react-native'
import {Item, Input, Label} from 'native-base'
import axios from 'axios'
import {Navigation} from 'react-native-navigation'

const GLOBALS = require('../Globals')

const url = GLOBALS.API_URL


export default class Main extends Component{


  constructor(props){
    super(props)
    this.state = {
      data:[],
      user:[],
      inputMessage:"",
      idMessage:"",
      message:"",
      deleteBtn:false,
      mainBtnText:"Send",
      mainBtnaction: () => this.send()
      
    }
  }

  componentDidMount(){
    setInterval(() => {
      this.fetchAll()
    }, 1000);
  }

  logout(){
    Navigation.setRoot({
      root: {
        component: {
          name: "login"
        }
      }
    });
  }


  async fetchAll(){
    const token = await AsyncStorage.getItem('@token')
    
    axios.get(`${url}/messages`, {
      headers:{
        'token':token
      }
    }).then((res) => {
      
      this.setState({data:res.data.data, user:res.data.users})  
    })
  }
  
  async send(){
    if(this.state.inputMessage == ""){
      alert('pesan masih kosong!')
    }else{
      const token = await AsyncStorage.getItem('@token')
      
      axios.post(`${url}/messages`,{
        message:this.state.inputMessage
      }, {
        headers:{
          'token':token
        }
      }).then((res) => {
        alert('berhasil')
        this.setState({inputMessage:""})
      }).catch((err) => {
        console.log(err);
        
      })
    }
  }
  
  _toEdit(id,msg){
    this.setState({
      idMessage:id, 
      deleteBtn:true, 
      mainBtnText:"Edit", 
      mainBtnaction:()=>this.edit(),
      inputMessage:msg
    })
  }
  
  delete(){
    Alert.alert("Hapus data","Anda yakin?", [
      {text: 'tidak'},
      {text: 'ya', onPress: async () => {
        const token = await AsyncStorage.getItem('@token')
        axios.delete(`${url}/messages/${this.state.idMessage}`, {
          headers:{
            'token':token
          }
        }).then((res)=>{
          alert('Pesan Berhasil dihapus')
          this.cancel()
          
        }).catch((err)=>{alert(err)})
      }},
      
    ],)
  }
  
  async edit(){
    const token = await AsyncStorage.getItem('@token')
    axios.patch(`${url}/messages`,{
      message:this.state.inputMessage,
      id:this.state.idMessage
    }, {
      headers:{
        'token':token
      }
    }).then((res) => {
      console.log(res);
      alert('berhasil diubah')
      this.cancel();
    }).catch((err) => {
      console.log(err);
      
    })
  }
  
  cancel(){
    this.setState({
      deleteBtn:false, 
      mainBtnText:"Send", 
      mainBtnaction:()=>this.send(),
      inputMessage:""
    })
  }

  _renderDeleteButton() {
    if(this.state.deleteBtn){
      return(
        <View style={{flexDirection:"row"}}>
          <View style={styles.wrapperHeader}>
            <TouchableOpacity onPress={()=> this.delete()}>
              <View style={styles.btnDelete}>
                <Text>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.wrapperHeader}>
            <TouchableOpacity onPress={()=> this.cancel()} >
              <View style={styles.btnCancel}>
                <Text>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  
  
  render(){
    return(
      <View style={{flex:1}}>
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <TouchableOpacity onPress={()=> this.logout()}>
              <View style={styles.logout}>
                <Text>logout</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.logo}>Simple-Chat</Text>
          </View>
          {this._renderDeleteButton()}
          
        </View>
        <View style={{flex:9}}>

        <FlatList
          data= {this.state.data}
          keyExtractor={(item, index)=> {return index.toString()}}
          renderItem={({item}) => (
            <View style={{minWidth:50}} key={item.id}>

            <TouchableHighlight onLongPress={()=>item.user_id==this.state.user.id ? this._toEdit(item.id, item.message): null} style={ item.user_id!=this.state.user.id ? styles.bubbleMsg : styles.ownBubbleMsg} delayLongPress={3000} key={item.id}>
              <View  key={item.id}>
                <Text style={styles.user}>{item.username}</Text>
                <Text style={styles.msg}>{item.message}</Text>
              </View>
            </TouchableHighlight>
            </View>
          )}
          />
        </View>
        <View style={{flex:1}}>

          <Item style={styles.wrapper}>
            <Input placeholder="type message" value={this.state.inputMessage} onChangeText={(value) => this.setState({inputMessage:value})} />
            <TouchableOpacity onPress={()=> this.state.mainBtnaction()}>
            <View style={[styles.btnSend]}>
              <Text style={styles.btnText}>{this.state.mainBtnText}</Text>
            </View>
          </TouchableOpacity>
          </Item>
        </View>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  bubbleMsg: {
    borderBottomLeftRadius: 0,
    backgroundColor:"#0FA",
    marginTop: 10,
    width:'50%',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  ownBubbleMsg: {
    backgroundColor:"#AAA",
    marginTop: 10,
    width:'50%',
    paddingVertical: 10,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    marginHorizontal: 10,
    justifyContent:'flex-end',
    marginLeft: 'auto',
    paddingHorizontal: 10,
  },
  wrapper:{
    paddingHorizontal:10,
    borderTopWidth: 0.5,
    borderTopColor: "#CCC",
  },
  btnSend:{
    backgroundColor:"#AFA",
    paddingVertical:10,
    paddingHorizontal:30,
    borderRadius:5
  },
  btnDelete:{
    backgroundColor:"#F30",
    paddingHorizontal:10,
    paddingVertical:10,
    borderRadius:5
  },
  btnCancel:{
    backgroundColor:"#CCC",
    paddingHorizontal:10,
    paddingVertical:10,
    borderRadius:5,
    marginLeft: 5,
  },
  logout:{
    backgroundColor:"#F90",
    paddingHorizontal:10,
    paddingVertical:10,
    borderRadius:5,
  },
  header:{
    flex:1, 
    flexDirection:"row", 
    justifyContent:"space-between", 
    paddingHorizontal:10,
    backgroundColor:"#DDD",
    borderBottomWidth: 0.5,
    borderBottomColor: "#AAA",
  },
  user:{
    fontWeight:"bold",
    fontSize:15
  },
  msg:{
    fontSize:13
  },
  wrapperHeader:{
    justifyContent:"center"
  },
  logoWrapper:{
    flexDirection:"row", 
    justifyContent:"center", 
    alignItems:"center"
  },
  logo:{
    fontSize:15,
    fontWeight:"bold",
    marginLeft:10
  }
})
