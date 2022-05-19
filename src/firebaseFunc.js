import {
  collection, doc, addDoc, getDocs, Timestamp,
} from 'firebase/firestore'
import format from 'date-fns/format'
import _get from 'lodash/get'
import _toNumber from 'lodash/toNumber'
import { db } from './firebase-config'

async function getAllData() {
  const docRef = await getDocs(collection(db, 'report'))
  const arr = []
  docRef.forEach((docs) => {
    const data = docs.data()
    data.id = docs.id
    data.created = `${format(
      _toNumber(`${_get(data, 'created.seconds')}000`),
      'dd/MM/yyyy',
    )} - ${format(_toNumber(`${_get(data, 'created.seconds')}000`), 'HH:mm')}`
    arr.push(data)
  })
  console.log(arr)
  return arr
}

async function setData(body) {
  await addDoc(collection(db, 'report'), {
    image: body.image,
    created: Timestamp.fromDate(body.date),
  })
}

export { getAllData, setData }
