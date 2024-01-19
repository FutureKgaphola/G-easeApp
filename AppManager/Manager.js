import React, { createContext, useState,useEffect } from "react";
import firestore from '@react-native-firebase/firestore';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [currentVisitorName, SetcurrentVisitorName]=useState('');
    const [currentVisitorId, SetcurrentVisitorId]=useState('');
    const [currentData,SetcurrentData]=useState({});
    useEffect(() => {
        const subscriber = firestore()
          .collection('users')
          .doc(currentVisitorId)
          .onSnapshot(documentSnapshot => {
            SetcurrentVisitorName(documentSnapshot.data()?.Name);
            SetcurrentData(documentSnapshot?.data());
          });
        return () => subscriber();
      }, [currentVisitorId]);

    return (
        <AppContext.Provider value={{
            currentVisitorName, SetcurrentVisitorName,
            currentVisitorId, SetcurrentVisitorId,
            currentData,SetcurrentData
        }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };