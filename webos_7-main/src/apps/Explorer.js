export default class Explorer {

    constructor(fs, wm, auth) {

        this.fs = fs;
        this.wm = wm;
        this.auth = auth;

        this.currentFolder = "root";

    }


    async open() {

        const user =
            this.auth.currentUser;

        if (!user) return;


        const nodes =
            await this.fs.getNodes(
                user.uid,
                this.currentFolder
            );


        const html =
            nodes.map(
                node => `

                <div
                    class="file-item"
                    data-id="${node.id}"
                    data-type="${node.type}"
                    style="
                        padding:8px;
                        cursor:pointer;
                    "
                >

                    ${
                        node.type === "folder"
                        ? "📁"
                        : "📄"
                    }

                    ${node.name}

                </div>

                `
            ).join("");


        const win =
            this.wm.createWindow(

                "Explorer",

                `

                <div>

                    현재 위치 :
                    ${this.currentFolder}

                </div>

                <button id="back-folder">
                    ← 뒤로
                </button>

                <br><br>

                <button id="new-folder">
                    새 폴더
                </button>

                <button id="new-file">
                    새 파일
                </button>

                <hr>

                <div id="folder-list">

                    ${html}

                </div>

                `
            );


        // =====================
        // 새 폴더
        // =====================

        win
            .querySelector(
                "#new-folder"
            )
            .addEventListener(

                "click",

                async () => {

                    const folderName =
                        prompt(
                            "폴더 이름"
                        );

                    if (!folderName) return;


                    await this.fs.createFolder(

                        user.uid,

                        folderName,

                        this.currentFolder

                    );


                    win.remove();

                    this.open();

                }
            );


        // =====================
        // 새 파일
        // =====================

        win
            .querySelector(
                "#new-file"
            )
            .addEventListener(

                "click",

                async () => {

                    const fileName =
                        prompt(
                            "파일 이름"
                        );

                    if (!fileName) return;


                    await this.fs.createFile(

                        user.uid,

                        fileName,

                        this.currentFolder

                    );


                    win.remove();

                    this.open();

                }
            );


        // =====================
        // 뒤로가기
        // =====================

        win
            .querySelector(
                "#back-folder"
            )
            .addEventListener(

                "click",

                () => {

                    this.currentFolder =
                        "root";

                    win.remove();

                    this.open();

                }
            );


        // =====================
        // 파일/폴더 이벤트
        // =====================

        win
            .querySelectorAll(
                ".file-item"
            )
            .forEach(

                item => {

                    // -----------------
                    // 더블클릭
                    // -----------------

                    item.addEventListener(

                        "dblclick",

                        async () => {

                            const type =
                                item.dataset.type;

                            const name =
                                item.textContent
                                .replace("📁", "")
                                .replace("📄", "")
                                .trim();


                            // 폴더 열기

                            if (
                                type === "folder"
                            ) {

                                this.currentFolder =
                                    name;

                                win.remove();

                                this.open();

                                return;

                            }


                            // 파일 열기

                            if (
                                type === "file"
                            ) {

                                const file =
                                    await this.fs.getFile(

                                        user.uid,

                                        name

                                    );


                                const noteWin =
                                    this.wm.createWindow(

                                        name,

                                        `

                                        <textarea
                                            id="editor"
                                            style="
                                                width:100%;
                                                height:300px;
                                            "
                                        >${file.content || ""}</textarea>

                                        <br><br>

                                        <button id="save-file">
                                            저장
                                        </button>

                                        `
                                    );


                                noteWin
                                    .querySelector(
                                        "#save-file"
                                    )
                                    .addEventListener(

                                        "click",

                                        async () => {

                                            const content =
                                                noteWin
                                                .querySelector(
                                                    "#editor"
                                                )
                                                .value;


                                            await this.fs.saveFile(

                                                user.uid,

                                                name,

                                                content

                                            );


                                            alert(
                                                "저장 완료"
                                            );

                                        }
                                    );

                            }

                        }
                    );


                    // -----------------
                    // 우클릭 삭제
                    // -----------------

                    item.addEventListener(

                        "contextmenu",

                        async (e) => {

                            e.preventDefault();


                            const name =
                                item.textContent
                                .replace("📁", "")
                                .replace("📄", "")
                                .trim();


                            const confirmDelete =
                                confirm(

                                    `${name} 삭제할까?`

                                );


                            if (
                                !confirmDelete
                            ) return;


                            await this.fs.deleteNode(

                                user.uid,

                                name

                            );


                            alert(
                                "삭제 완료"
                            );


                            win.remove();

                            this.open();

                        }

                    );

                }

            );

    }

}