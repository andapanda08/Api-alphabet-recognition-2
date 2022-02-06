import * as React from "react"
import {Button, View, Image, Platform} from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
  state={
    image:null
  }
    render(){
      let {image}=this.state
    return(
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Button title="Pick an image from the camera roll" onPress={this._pickimage}/>
      </View>
    )
  }

  componentDidMount(){
    this.getCameraPermissionAsync()
  }

  getCameraPermissionAsync=async()=>{
    if(Platform.OS!=="web"){
      const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if(status!=="granted"){
        alert("Sorry, we need camera roll permissions to make this work.")
      }
    }
  }

  uploadImaage=async(uri)=>{
    const data=new FormData()
    let filename=uri.split('/')[uri.split('/').length-1]
    let type=`image/${uri.split('.')[uri.split('.').length - 1]}`
    const fileToUpload={
      uri:uri,
      name:filename,
      type:type
    } 
    data.append("digit", fileToUpload)
    fetch('https://f292a3137990.ngrok.io/predict-digit', {
      method:'POST',
      body:data,
      headers:{'content-type':'multipart/form-data'}
    })
    .then((response)=>response.json())
    .then((result)=>{
      console.log("success", result)
    }) 
    .catch((error)=>{
      console.log("error", error)
    })
    
    }



    _pickimage=async()=>{
      try{
        let result=await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.ALL,
          allowEditing:true,
          aspect:[4,3],
          quality:1
        })
        if(!result.canceled){
          this.setState({image:result.data})
          console.log=(result.uri)
          this.uploadImage(result.uri)
        }
      }
      catch(E){
        console.log(E)
      }
    }
    
}