import React, { Component } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage, FlatList, TouchableHighlight, Alert} from 'react-native'
import {Item, Input, Label} from 'native-base'
import axios from 'axios'
import {Navigation} from 'react-native-navigation'
import KeyboardSpacer from 'react-native-keyboard-spacer';
const moment = require('moment');

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
      mainBtnaction: () => this.send(),
      isSelected:false
    }
    intervalId=0
  }

  componentDidMount(){
    this.intervalId = setInterval(() => {
                        this.fetchAll()
                      }, 2000);
  }

  componentWillUnmount(){
    clearInterval(this.intervalId)
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
    }).catch((err)=> alert(err.response.data.msg))
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
        this.setState({inputMessage:""})
      }).catch((err) => {
        alert(err.response.data.msg)
        
      })
    }
  }
  
  _toEdit(id,msg){
    this.setState({
      idMessage:id, 
      deleteBtn:true, 
      mainBtnText:"Edit", 
      mainBtnaction:()=>this.edit(),
      inputMessage:msg,
      isSelected:true
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
          
        }).catch((err)=>alert(err.response.data.msg))
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
      alert(err.response.data.msg)
      
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
            inverted
            data= {this.state.data}
            keyExtractor={(item, index)=> {return index.toString()}}
            renderItem={({item}) => (
              <View style={{minWidth:300}} key={item.id} >

              <TouchableHighlight onLongPress={()=>item.user_id==this.state.user.id ? this._toEdit(item.id, item.message): null} style={ item.user_id!=this.state.user.id ? styles.bubbleMsg : styles.ownBubbleMsg} key={item.id}>
                <View  key={item.id} >
                  <Text style={styles.user}>{item.user_id==this.state.user.id ? "Me": item.username}</Text>
                  <Text style={styles.msg}>{item.message}</Text>
                  <Text style={styles.time}>{moment(item.created_at).format('LT')}</Text>
                </View>
              </TouchableHighlight>
              </View>
            )}
            />
          </View>
          <View>

            <Item style={styles.wrapper}>
              <Input placeholder="message..." value={this.state.inputMessage} onChangeText={(value) => this.setState({inputMessage:value})} multiline={true} />
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
    justifyContent:"flex-start",
    backgroundColor:"#0FA",
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginRight: 'auto',
    minWidth:100
  },
  ownBubbleMsg: {
    backgroundColor:"#AAA",
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    marginHorizontal: 10,
    justifyContent:'flex-end',
    marginLeft: 'auto',
    paddingHorizontal: 10,
    minWidth:100
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
    flexDirection:"row", 
    justifyContent:"space-between", 
    paddingHorizontal:10,
    paddingVertical:10,
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
  time:{
    fontSize:10,
    textAlign:"right",
    color:"#08F",
    marginTop:10
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
