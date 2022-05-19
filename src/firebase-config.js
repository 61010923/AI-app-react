import { initializeApp } from 'firebase/app'
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAULZWDIELhtjtnhQp2eDrTDp2Ahum7tb8',
  authDomain: 'ai-webapp-5cc20.firebaseapp.com',
  projectId: 'ai-webapp-5cc20',
  storageBucket: 'ai-webapp-5cc20.appspot.com',
  messagingSenderId: '1074633251161',
  appId: '1:1074633251161:web:0ef04bfff616b150c11448',
  measurementId: 'G-2MRGDLWY0W',
}

const app = initializeApp(firebaseConfig)

// eslint-disable-next-line import/prefer-default-export
export const db = getFirestore(app)
