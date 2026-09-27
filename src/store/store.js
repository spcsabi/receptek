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
      actions: {      },
    })),
  ),
);

export default useStore;
