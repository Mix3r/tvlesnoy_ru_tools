@echo off
setlocal
cd /d %~dp0
Call :UnZipFile "C:\Program Files\Totalcmd_p\FFMPEG\" "%~dp0ffmpeg-master-latest-win64-gpl-shared.zip"
exit /b

:UnZipFile <ExtractTo> <newzipfile>
set vbs="%temp%\_.vbs"
if exist %vbs% del /f /q %vbs%
>%vbs%  echo Set fso = CreateObject("Scripting.FileSystemObject")
>>%vbs% echo If NOT fso.FolderExists(%1) Then
>>%vbs% echo fso.CreateFolder(%1)
>>%vbs% echo End If
>>%vbs% echo set objShell = CreateObject("Shell.Application")
>>%vbs% echo set FilesInZip=objShell.NameSpace(%2).items
>>%vbs% echo objShell.NameSpace(%1).CopyHere(FilesInZip)
>>%vbs% echo Set fso = Nothing
>>%vbs% echo Set objShell = Nothing
cscript //nologo %vbs%
cd /D %1
robocopy ".\ffmpeg-master-latest-win64-gpl-shared\bin" "..\FFMPEG" /E /MOV
robocopy ".\ffmpeg-master-latest-win64-gpl-shared\bin" ".\ffmpeg-master-latest-win64-gpl-shared" /MIR
rmdir /s /q "ffmpeg-master-latest-win64-gpl-shared"
if exist %vbs% del /f /q %vbs%
