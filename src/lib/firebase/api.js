import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, updatePassword } from "firebase/auth";
import { Timestamp, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from './config';

// Sign up a new user
export async function signUp(auth, user, db) {
    const { email, password, nickname, dob, intro, gender } = user;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const account = userCredential.user;

        console.log("Account created: ", account.uid);

        const userData = {
            email,
            nickname,
            dob: Timestamp.fromDate(new Date(dob)),
            intro,
            gender,
            avatarUrl: (gender == "male") ? "/icons/manAvatar.png" : "icons/womanAvatar.png"
        };
        await setDoc(doc(db, "users", account.uid), userData);

        await updateProfile(account, {
            displayName: nickname,
            photoURL: userData.avatarUrl,
            email: email
        });

        return account;
    } catch (error) {
        throw new Error(`Failed to sign up: ${error.message}`);
    }
}

export function getCurrentUser() {
    return auth.currentUser;
}

export async function fetchUserData(db, uid) {
    try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            return userData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetchong user data", error);
    }
}

// Sign in with email and password
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; // Return the user object
    } catch (error) {
        throw new Error(`Failed to sign in: ${error.message}`);
    }
}

export async function saveUserData(uid, data) {
    try {
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, data, { merge: true });
    } catch (error) {
        console.error("Error saving user data", error);
    }
}

// Sign out the current user
export async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        throw new Error(`Failed to sign out: ${error.message}`);
    }
}


// Add a new meal
export async function addMeal(uid, mealType, foods) {
    try {
        const totalCalories = foods.reduce((acc, food) => acc + food.calories, 0);
        const mealData = {
            userId: uid,
            mealType,
            foods,
            totalCalories,
            createdAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, "meals"), mealData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding meal:", error);
        throw error;
    }
}

export async function changePassword(email, currentPassword, newPassword) {
    const user = getCurrentUser();
    const credentials = signInWithEmailAndPassword(auth, email, currentPassword);
    try {
        await updatePassword(user, newPassword);
        return true; // Password updated successfully
    } catch (error) {
        console.error("Error updating password:", error);
        throw new Error(`Failed to update password: ${error.message}`);
    }
}

/*
Intake
*/
// Update an existing meal
export async function updateMeal(mealId, foods) {
    try {
        const totalCalories = foods.reduce((acc, food) => acc + food.calories, 0);
        const mealData = { foods, totalCalories };
        await updateDoc(doc(db, "meals", mealId), mealData);
    } catch (error) {
        console.error("Error updating meal:", error);
        throw error;
    }
}

// Delete a meal
export async function deleteMeal(mealId) {
    try {
        await deleteDoc(doc(db, "meals", mealId));
    } catch (error) {
        console.error("Error deleting meal:", error);
        throw error;
    }
}

// Fetch meals for a user
export async function fetchUserMeals(uid) {
    try {
        const mealsCollectionRef = collection(db, "meals");
        const mealsQuerySnapshot = await getDocs(mealsCollectionRef);

        const meals = [];
        mealsQuerySnapshot.forEach((doc) => {
            const mealData = doc.data();
            if (mealData.userId === uid) {
                meals.push({ id: doc.id, ...mealData });
            }
        });

        return meals;
    } catch (error) {
        console.error("Error fetching meals data", error);
        throw error;
    }
}

// Calculate total calories for a user
export async function calculateTotalCalories(uid) {
    try {
        const meals = await fetchUserMeals(uid);
        const totalCalories = meals.reduce((acc, meal) => acc + meal.totalCalories, 0);
        return totalCalories;
    } catch (error) {
        console.error("Error calculating total calories", error);
        throw error;
    }
}


//save the chat to firebase
export const saveChatToFirebase = async (userId, chatHistory) => {
    const chatRef = doc(collection(db, "chats"), userId);
    await setDoc(chatRef, { history: chatHistory });
};

//load chat history from firebase
export const loadChatFromFirebase = async (userId) => {
    const chatRef = doc(collection(db, "chats"), userId);
    const docSnap = await getDoc(chatRef);

    if (docSnap.exists()) {
        return docSnap.data().history;
    } else {
        return [];
    }
};