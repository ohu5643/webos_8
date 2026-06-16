import { speak } from "../services/TTSService.js";
import { parseCommand } from "../services/CommandParser.js";

import {

    getRuntimeContext

} from "../services/RuntimeContext.js";


export default class AIAssistant {

    constructor(
        wm,
        explorer,
        notepad,
        fs,
        auth
    ){

        this.wm = wm;
        this.explorer = explorer;
        this.notepad = notepad;
        this.fs = fs;
        this.auth = auth;
    }

    open(){

        const aiWin =
            this.wm.createWindow(

                "AI Assistant",

                `

                <div
                    id="chat"

                    style="
                        height:300px;
                        overflow:auto;
                        border:1px solid #555;
                        margin-bottom:10px;
                        padding:5px;
                    "

                ></div>

                <textarea
                    id="prompt"

                    style="
                        width:100%;
                        height:80px;
                    "

                ></textarea>

                <button id="send-ai">

                    전송

                </button>

                `
            );


        const sendBtn =
            aiWin.querySelector(
                "#send-ai"
            );


        sendBtn.addEventListener(

            "click",

            async ()=>{

                const prompt =
                    aiWin
                    .querySelector(
                        "#prompt"
                    )
                    .value;


                const chat =
                    aiWin
                    .querySelector(
                        "#chat"
                    );


                chat.innerHTML += `

                    <div>

                        <b>나:</b>
                        ${prompt}

                    </div>

                `;


                // ---------- 명령어 확인 ----------
                const command =
                    parseCommand(
                        prompt
                    );


                if(command){

                    if(
                        command.action ===
                        "open_notepad"
                    ){

                        this.notepad.open();

                        chat.innerHTML += `

                            <div>

                                <b>AI:</b>
                                메모장을 실행했어요.

                            </div>

                        `;

                        speak(
                            "메모장을 실행했어요"
                        );

                        return;

                    }


                    if(
                        command.action ===
                        "open_explorer"
                    ){

                        this.explorer.open();

                        chat.innerHTML += `

                            <div>

                                <b>AI:</b>
                                파일 탐색기를 열었어요.

                            </div>

                        `;

                        speak(
                            "파일 탐색기를 열었어요"
                        );

                        return;

                    }

                    if(
                        command.action ===
                        "create_folder"
                    ){

                        const user =
                            this.auth.currentUser;


                        await this.fs.createFolder(

                            user.uid,

                            command.name

                        );


                        chat.innerHTML += `

                            <div>

                                <b>AI:</b>
                                ${command.name}
                                폴더를 만들었어요.

                            </div>

                        `;


                        speak(
                            "폴더 생성 완료"
                        );

                        return;

                    }

                    if(
                        command.action ===
                        "show_os_features"
                    ){

                        const answer = `
                    WebOS 기능

                    - 파일 탐색기
                    - 메모장
                    - AI Assistant
                    - Terminal
                    - 음성 출력(TTS)
                    - Firebase 파일 저장
                    `;

                        chat.innerHTML += `
                            <div>
                                <b>AI:</b>
                                <pre>${answer}</pre>
                            </div>
                        `;

                        speak(answer);

                        return;
                    }

                    if(
                        command.action ===
                        "show_terminal_commands"
                    ){

                        const answer = `
                    사용 가능한 터미널 명령어

                    help
                    ls
                    mkdir [폴더명]
                    touch [파일명]
                    clear
                    `;

                        chat.innerHTML += `
                            <div>
                                <b>AI:</b>
                                <pre>${answer}</pre>
                            </div>
                        `;

                        speak(answer);

                        return;
                    }

                    if(
                        command.action ===
                        "list_files"
                    ){

                        const runtime =
                            await getRuntimeContext(
                                this.fs,
                                this.auth
                            );

                        const files =
                            runtime.currentFiles || [];

                        chat.innerHTML += `
                            <div>
                                <b>AI:</b>
                                현재 파일 목록:
                                <pre>
                                ${files.map(file =>
                                `${file.type} : ${file.name}`
                                ).join("\n")}
                                </pre>
                            </div>
                        `;

                        return;
                    }

                    }


                // ---------- Gemini API ----------
               const runtime =

                   await getRuntimeContext(

                       this.fs,

                       this.auth

                   );


                
                try {

    const response =
        await fetch(

            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AQ.Ab8RN6Jr7HjAULwv17EVTH2pFfzirEujX_l-8Yu6PRx-plbvYw",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    contents:[

                        {

                            parts:[

                                {

                                    text:`

                                    너는 WebOS 내부 AI 비서이다.

                                    현재 시스템 상태:

                                    ${JSON.stringify(runtime)}

                                    사용자의 질문:

                                    ${prompt}

                                    규칙:

                                    - WebOS 구조를 이해하고 답변해라.
                                    - 현재 파일 목록을 참고할 수 있다.
                                    - Terminal 명령어를 설명할 수 있다.
                                    - 현재 OS 기능을 설명할 수 있다.

                                    `

                                }

                            ]

                        }

                    ]

                })

            }

        );



    if(!response.ok){

        throw new Error(

            `HTTP ${response.status}`

        );

    }


    const data =
        await response.json();


    const answer =
        data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;


    if(!answer){

        throw new Error(

            JSON.stringify(data)

        );

    }


    chat.innerHTML += `

        <div>

            <b>AI:</b>
            ${answer}

        </div>

    `;


    speak(answer);

}
catch(err){

    console.error(err);

    chat.innerHTML += `

        <div>

            <b>AI:</b>
            응답 생성 실패:
            ${err.message}

        </div>

    `;

}

            }

        );

    }

}
