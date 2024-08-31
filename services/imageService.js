import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import { supabase } from '../lib/supabase'
import { supabaseUrl } from '../constants'

export const getUserImageSrc= imagePath=>{
    if (imagePath){
        return getSupabaseFileUrl(imagePath)
    
    }else{
        return require('../assets/images/defaultUsers.png')
    }
}

export const getSupabaseFileUrl= filePath =>{
    if(filePath){
        return {uri:`${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
    }
    return null;
}

export const downloadFile = async(url)=>{
    try {
        const {uri}= await FileSystem.downloadAsync(url,getLocalFilePath(url));
        return uri;
    } catch (error) {
        return null;
    }
}

export const getLocalFilePath = (url)=>{
    let fileName=filePath.Split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
}

export const uploadFile = async(folderName, fileUri, isimage=true)=>{
    try {
        let fileName = getfilePath(folderName,isimage);
        const fileBase64=await FileSystem.readAsStringAsync(fileUri,{
            encoding: FileSystem.EncodingType.Base64
        });
        let imageData= decode(fileBase64)
        let {data,error}= await supabase
        .storage
        .from('uploads')
        .upload(fileName, imageData,
            {   
                cacheControl:'3600',
                upsert:false,
                contentType: isimage? 'image/*':'video/*'
            }
        );
        if (error){
            console.log('erreur de telechargement du fichier: ',error);
        return{success: false, msg:'impossible de telecharger l\'image'}
        }

        return {success:true, data:data.path}


    } catch (error) {
        console.log('erreur de telechargement du fichier: ',error);
        return{success: false, msg:'impossible de telecharger l\'image'}
        
    }

}

export const getfilePath=(folderName,isimage)=>{
    return `/${folderName}/${(new Date()).getTime()}${isimage? '.png':'.mp4'}`;

}