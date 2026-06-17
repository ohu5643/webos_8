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

            await setDoc(
                doc(
                    db,
                    "users",
                    uid,
                    "filesystem",
                    folder
                ), {
                    name: folder,
                    type: "folder",
                    parent: "root"
                }
            );

        }

        console.log(
            "Filesystem initialized"
        );

    }

    async getNodes(
        uid,
        parent = "root"
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
                node.parent === parent
            );

    }

    async createFolder(
        uid,
        folderName,
        parent = "root"
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
                parent
            }

        );

    }

    async createFile(
        uid,
        fileName,
        parent = "root"
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
                parent,
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

                node.name

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