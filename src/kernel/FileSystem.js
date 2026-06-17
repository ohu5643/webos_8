import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    addDoc
}
from "firebase/firestore";

import {
    db
}
from "../firebase/firebase.js";

export default class FileSystem {

    async initialize(uid) {

        const ref =
            collection(
                db,
                "users",
                uid,
                "filesystem"
            );

        const snapshot =
            await getDocs(ref);

        if (!snapshot.empty) return;

        const defaults = [
            "Documents",
            "Downloads",
            "Pictures",
            "Desktop"
        ];

        for (const folder of defaults) {

            await addDoc(

                collection(
                    db,
                    "users",
                    uid,
                    "filesystem"
                ),

                {
                    name: folder,
                    type: "folder",
                    parentId: null
                }

            );
        }

        console.log(
            "Filesystem initialized"
        );

    }

    async getNodes(
        uid,
        parentId = null
    ) {

        const ref =
            collection(
                db,
                "users",
                uid,
                "filesystem"
            );

        const snapshot =
            await getDocs(ref);

        return snapshot.docs
            .map(
                doc => ({
                    id: doc.id,
                    ...doc.data()
                })
            )
            .filter(
                node =>
                node.parentId === parentId
            );

    }

    async createFolder(
        uid,
        folderName,
        parentId = null
    ) {

        await addDoc(

            collection(
                db,
                "users",
                uid,
                "filesystem"
            ),

            {
                name: folderName,
                type: "folder",
                parentId
            }

        );

    }

    async createFile(
        uid,
        fileName,
        parentId = null
    ) {

        await addDoc(

            collection(
                db,
                "users",
                uid,
                "filesystem"
            ),

            {
                name: fileName,
                type: "file",
                parentId,
                content: ""
            }

        );

    }

    async getFile(
        uid,
        fileId
    ) {

        const ref =
            doc(
                db,
                "users",
                uid,
                "filesystem",
                fileId
            );

        const snapshot =
            await getDoc(ref);

        return snapshot.data();

    }

    async saveFile(
        uid,
        fileId,
        content
    ) {

        const oldFile =
            await this.getFile(
                uid,
                fileId
            );

        await setDoc(
            doc(
                db,
                "users",
                uid,
                "filesystem",
                fileId
            ), {
                ...oldFile,
                content
            }
        );

    }

    async deleteNode(
        uid,
        nodeId
    ) {

        const nodes =
            await this.getNodes(
                uid,
                nodeId
            );


        for (
            const node of nodes
        ) {

            await this.deleteNode(

                uid,

                node.id

            );

        }


        await deleteDoc(

            doc(

                db,

                "users",

                uid,

                "filesystem",

                nodeId

            )

        );

    }

    async getAllNodes(uid) {

        const ref =
            collection(
                db,
                "users",
                uid,
                "filesystem"
            );

        const snapshot =
            await getDocs(ref);

        return snapshot.docs.map(
            doc => ({
                id: doc.id,
                ...doc.data()
            })
        );

    }

}