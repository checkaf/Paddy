import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth } from '../firebase/config.js';

const db = getFirestore();

// Products
export async function listProducts() {
    const snap = await getDocs(collection(db, 'products'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProduct(product) {
    const user = auth.currentUser;
    return await addDoc(collection(db, 'products'), {
        ...product,
        ownerUid: user?.uid || null,
        createdAt: Date.now(),
    });
}

export async function getProduct(id) {
    const ref = doc(db, 'products', id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateProduct(id, data) {
    await updateDoc(doc(db, 'products', id), data);
}

export async function removeProduct(id) {
    await deleteDoc(doc(db, 'products', id));
}

// Orders
export async function listOrdersForUser(uid) {
    const q = query(collection(db, 'orders'), where('userUid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function placeOrder({ productId, qty }) {
    const user = auth.currentUser;
    return await addDoc(collection(db, 'orders'), {
        productId,
        qty,
        userUid: user?.uid || null,
        status: 'Pending',
        createdAt: Date.now(),
    });
}

export async function updateOrderStatus(id, status) {
    await updateDoc(doc(db, 'orders', id), { status });
}

// Reviews
export async function addReview({ productId, rating, comment }) {
    const user = auth.currentUser;
    return await addDoc(collection(db, 'reviews'), {
        productId,
        rating,
        comment,
        authorUid: user?.uid || null,
        createdAt: Date.now(),
    });
}

export async function listReviews(productId) {
    const q = query(collection(db, 'reviews'), where('productId', '==', productId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}