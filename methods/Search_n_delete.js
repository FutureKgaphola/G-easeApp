import firestore from '@react-native-firebase/firestore';

export const searchdelete=(table,where1,where2,compOprator)=>{
    firestore()
          .collection(table)
          .where(where1, compOprator, where2.trim()).get()
          .then(querySnapshot => {
            if (querySnapshot.size==1) { 
                querySnapshot.docs.forEach(data=>{
                    try{
                        firestore()
                        .collection(table)
                        .doc(data.id)
                        .delete()
                    }catch(er){console.log(String(er))}
                })
            }

            })

}