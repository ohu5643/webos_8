export function parseCommand(text){

    const lower =
        text.toLowerCase().trim();

    if(
        lower.includes("메모장")
    ){
        return {
            action:"open_notepad"
        };
    }

    if(
        lower.includes("파일 탐색기")
        ||
        lower.includes("탐색기")
        ||
        lower.includes("explorer")
    ){
        return {
            action:"open_explorer"
        };
    }

    if(
        lower.includes("내 파일")
        ||
        lower.includes("파일 목록")
        ||
        lower.includes("파일 뭐")
    ){
        return {
            action:"list_files"
        };
    }

    if(
        lower.includes("운영체제 기능")
        ||
        lower.includes("os 기능")
    ){
        return {
            action:"show_os_features"
        };
    }

    if(
        lower.includes("터미널 명령어")
    ){
        return {
            action:"show_terminal_commands"
        };
    }

    if(
        lower.includes("폴더")
        &&
        (
            lower.includes("만들")
            ||
            lower.includes("생성")
        )
    ){

        const words =
            text.split(" ");

        return {

            action:"create_folder",

            name:words[0]

        };

    }

    return null;
}