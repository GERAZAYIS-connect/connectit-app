import { supabase } from "../lib/supabase";

export const createNotification=async(notification)=>{
    try {
        const {data, error}=await supabase
        .from('notification')
        .insert(notification)
        .select()
        .single();

        if(error){
            console.log("notification  error: ", error)
            return{success:false, msg:"erreur de chargement de(s) notification(s)"};
        }

        return{success:true, data};
    } catch (error) {
        console.log("notification error: ", error)
        return{success:false, msg:"erreur de chargement de(s) notification(s) "};
    }
}

export const fetchnotification = async (receverId) => {

  // Vérifiez si receverId est défini et est un UUID valide

  if (!receverId) {
    console.log("fetchNotification error: receverId is undefined or null");
    return { success: false, msg: "L'ID du récepteur est requis pour récupérer les notifications." };
  }

  try {
    const { data, error } = await supabase
      .from('notification')
      .select(`
        *,
        sender: senderId(id, name, image)
      `)
      .eq('receverId', receverId)
      .order("created_at", { ascending: false })

    if (error) {
      console.log("fetchNotification error: ", error);
      return { success: false, msg: "impossible de colleter les notifications" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("fetchNotification error: ", error);
    return { success: false, msg: "impossible de colleter les notifications" };
  }
};
