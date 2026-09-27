import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { initialState, initialStateNotToStore } from "./initialData";
import { devtools } from "zustand/middleware";
import { db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const useStore = create()(
  devtools(
    immer((set) => ({
      ...initialState,
      ...initialStateNotToStore,
      isLoaded: false,
      actions: {
        subscribeToData: (userId) => {
          const unsubTransactions = onSnapshot(
            collection(db, "transactions"),
            (snapshot) => {
              const transactions = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              }));
              set(
                (state) => {
                  state.transactions = transactions;
                },
                false,
                "sync/transactions",
              );
            },
          );

          const unsubProjects = onSnapshot(
            collection(db, "projects"),
            (snapshot) => {
              const projects = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              }));
              set(
                (state) => {
                  state.projects = projects;
                },
                false,
                "sync/projects",
              );
            },
          );

          const unsubGlobalData = onSnapshot(
            doc(db, "globalData", "global"),
            (docSnap) => {
              if (docSnap.exists()) {
                set(
                  (state) => {
                    state.currencies = docSnap.data().currencies || [];
                  },
                  false,
                  "sync/globaldata",
                );
              }
            },
          );

          let unsubUserProfiles = () => {};
          if (userId) {
            unsubUserProfiles = onSnapshot(
              doc(db, "userProfiles", userId),
              (docSnap) => {
                if (docSnap.exists()) {
                  set(
                    (state) => {
                      state.userProfile = docSnap.data();
                    },
                    false,
                    "sync/userProfile",
                  );
                }
              },
            );
          }

          return () => {
            unsubTransactions();
            unsubProjects();
            unsubGlobalData();
            unsubUserProfiles();
          };
        },

        addTransaction: async (newTransaction) => {
          await addDoc(collection(db, "transactions"), {
            ...newTransaction,
            createdAt: new Date().toISOString(),
          });
        },

        addProject: async (newProject) => {
          await addDoc(collection(db, "projects"), {
            ...newProject,
            createdAt: new Date().toISOString(),
          });
        },

        updateTransaction: async (id, key, value) => {
          const projectRef = doc(db, "transactions", id);
          await updateDoc(projectRef, {
            [key]: value,
          });
        },

        updateProjects: async (id, key, value) => {
          const projectRef = doc(db, "projects", id);
          await updateDoc(projectRef, {
            [key]: value,
          });
        },

        updateUserProfileField: async (userId, key, value) => {
          if (!userId) return;
          const userRef = doc(db, "userProfiles", userId);
          await updateDoc(userRef, {
            [key]: value,
          });
        },

        updateGlobalDataField: async (key, value) => {
          const userRef = doc(db, "globalData", "global");
          await updateDoc(userRef, {
            [key]: value,
          });
        },

        deleteTransaction: async (id) => {
          await deleteDoc(doc(db, "transactions", id));
        },

        deleteProject: async (id) => {
          await deleteDoc(doc(db, "projects", id));
        },
      },
    })),
  ),
);

export default useStore;
