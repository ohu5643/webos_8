export default class Terminal {

    constructor(
        fs,
        wm,
        auth
    ) {

        this.fs = fs;
        this.wm = wm;
        this.auth = auth;

        this.currentPath = ["root"];

    }

    open() {

        const termWin =
            this.wm.createWindow(

                "Terminal",

                `

                <div
                    id="terminal-output"

                    style="
                        background:black;
                        color:lime;
                        height:300px;
                        overflow:auto;
                        padding:10px;
                        font-family:monospace;
                    "

                >

                    WebOS Terminal<br><br>

                </div>

                <input
                    id="terminal-input"

                    style="
                        width:100%;
                    "

                    placeholder="command..."
                >

                `
            );


        const output =
            termWin.querySelector(
                "#terminal-output"
            );


        const input =
            termWin.querySelector(
                "#terminal-input"
            );


        input.addEventListener(

            "keydown",

            async (e) => {

                if (
                    e.key !== "Enter"
                ) return;


                const command =
                    input.value.trim();


                input.value = "";


                output.innerHTML +=
                    `> ${command}<br>`;


                const user =
                    this.auth.currentUser;


                // help
                if (
                    command === "help"
                ) {

                    output.innerHTML +=
                        `
                    
                    
                   
                   
                   
                    
                   
                    help<br>
ls<br>
pwd<br>
cd [folder]<br>
mkdir [name]<br>
touch [name]<br>
rm [name]<br>
cat [filename]<br>
tree<br>
whoami<br>
date<br>
echo [text]<br>
clear<br><br>
                    `;

                    return;

                }


                // ls
                if (
                    command === "ls"
                ) {

                    const files =
                        await this.fs.getNodes(
                            user.uid,

                            this.currentFolder
                        );


                    files.forEach(

                        file => {

                            output.innerHTML +=

                                file.type === "folder"

                                ?

                                `📁 ${file.name}<br>`

                                :

                                `📄 ${file.name}<br>`;

                        }

                    );

                    output.innerHTML +=
                        "<br>";

                    return;

                }


                // mkdir
                if (
                    command.startsWith(
                        "mkdir "
                    )
                ) {

                    const folderName =
                        command.replace(
                            "mkdir ",
                            ""
                        );


                    await this.fs.createFolder(
                        user.uid,
                        folderName,
                        this.currentFolder
                    );


                    output.innerHTML +=
                        `
                    folder created<br><br>
                    `;

                    return;

                }


                // touch
                if (
                    command.startsWith(
                        "touch "
                    )
                ) {

                    const fileName =
                        command.replace(
                            "touch ",
                            ""
                        );


                    await this.fs.createFile(
                        user.uid,
                        fileName,
                        this.currentFolder
                    );


                    output.innerHTML +=
                        `
                    file created<br><br>
                    `;

                    return;

                }

                // rm
                if (
                    command.startsWith(
                        "rm "
                    )
                ) {

                    const name =
                        command.replace(
                            "rm ",
                            ""
                        );

                    const files =
                        await this.fs.getNodes(
                            user.uid,
                            this.currentFolder
                        );

                    const target =
                        files.find(
                            file =>
                            file.name === name
                        );

                    if (!target) {

                        output.innerHTML +=
                            `
        file not found<br><br>
        `;

                        return;

                    }

                    await this.fs.deleteNode(
                        user.uid,
                        target.id
                    );

                    output.innerHTML +=
                        `
    deleted<br><br>
    `;

                    return;

                }

                if (
                    command === "pwd"
                ) {

                    output.innerHTML +=
                        `${this.currentFolder}<br><br>`;

                    return;

                }

                if (
                    command.startsWith(
                        "cd "
                    )
                ) {

                    const folderName =
                        command.replace(
                            "cd ",
                            ""
                        );

                    if (folderName === "..") {

                        this.currentFolder =
                            "root";

                        output.innerHTML +=
                            "back to root<br><br>";

                        return;
                    }


                    const files =
                        await this.fs.getNodes(

                            user.uid,

                            this.currentFolder

                        );


                    const target =
                        files.find(

                            file =>

                            file.name === folderName &&
                            file.type === "folder"

                        );


                    if (
                        !target
                    ) {

                        output.innerHTML +=
                            "folder not found<br><br>";

                        return;

                    }


                    this.currentFolder =
                        folderName;


                    output.innerHTML +=
                        "directory changed<br><br>";

                    return;

                }

                if (
                    command === "whoami"
                ) {

                    output.innerHTML +=
                        `
        user:
        ${user.uid}<br><br>
        `;

                    return;

                }

                if (
                    command === "date"
                ) {

                    output.innerHTML +=
                        `
        ${new Date()}<br><br>
        `;

                    return;

                }

                if (
                    command.startsWith(
                        "echo "
                    )
                ) {

                    const text =
                        command.replace(
                            "echo ",
                            ""
                        );

                    output.innerHTML +=
                        `${text}<br><br>`;

                    return;

                }

                if (
                    command.startsWith(
                        "cat "
                    )
                ) {

                    const fileName =
                        command.replace(
                            "cat ",
                            ""
                        );

                    const file =
                        await this.fs.getFile(
                            user.uid,
                            fileName
                        );

                    if (!file) {

                        output.innerHTML +=
                            "file not found<br><br>";

                        return;
                    }

                    output.innerHTML +=
                        `
        ${file.content || ""}
        <br><br>
        `;

                    return;

                }

                if (
                    command === "tree"
                ) {

                    const files =
                        await this.fs.getAllNodes(
                            user.uid
                        );

                    output.innerHTML +=
                        `root<br>`;

                    files.forEach(

                        file => {

                            output.innerHTML +=

                                file.type === "folder"

                                ?

                                ` ├ 📁 ${file.name}<br>`

                                :

                                ` ├ 📄 ${file.name}<br>`;

                        }

                    );

                    output.innerHTML +=
                        "<br>";

                    return;

                }


                // clear
                if (
                    command === "clear"
                ) {

                    output.innerHTML =
                        "";

                    return;

                }


                output.innerHTML +=
                    `
                unknown command<br><br>
                `;

            }

        );

    }

}
