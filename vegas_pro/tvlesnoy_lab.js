function ConvertTextRequest() {
    let inputF = document.getElementById("srclink");
    let outputF = inputF.value + '';
    let vid_info_link = outputF.indexOf('//');
    if (vid_info_link >= 0) {
        outputF = outputF.substring(vid_info_link+2);
    }
    vid_info_link = outputF.indexOf('/');
    outputF = outputF.substring(vid_info_link);
    outputF = 'https://get-save.com'+outputF;
    open(outputF);
}
