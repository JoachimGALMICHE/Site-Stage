// ── CONFIG FIREBASE ──────────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCm5zSAJWQ6Le3-5Lb7b6DUmnGqYzBk0wk",
  authDomain: "l-oeil-d-euclyde.firebaseapp.com",
  projectId: "l-oeil-d-euclyde",
  storageBucket: "l-oeil-d-euclyde.firebasestorage.app",
  messagingSenderId: "179241004963",
  appId: "1:179241004963:web:c7c7afa926e03032653416"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── HELPERS ──────────────────────────────────────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function setUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function getAuthors() {
  const snap = await getDocs(collection(db, 'auteurs'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addAuthor(data) {
  return await addDoc(collection(db, 'auteurs'), data);
}

export async function updateAuthor(id, data) {
  await updateDoc(doc(db, 'auteurs', id), data);
}

export async function deleteAuthor(id) {
  await deleteDoc(doc(db, 'auteurs', id));
}

export async function getArticles() {
  const snap = await getDocs(query(collection(db, 'articles'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addArticle(data) {
  return await addDoc(collection(db, 'articles'), { ...data, createdAt: new Date() });
}

export async function updateArticle(id, data) {
  await updateDoc(doc(db, 'articles', id), data);
}

export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc };
