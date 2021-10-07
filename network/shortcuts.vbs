' Создать сетевые ярлыки  (и удалить себя)
Dim FileName, scriptdir
    scriptdir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

    FileName = "_КУР_ЗВУКОРЕЖИССЕР"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\xrebtova\Монтаж звука"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_КУР_МЕХАНИК"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\MIKHEEV\Захват"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_КУР_КОРРЕСПОНДЕНТ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Ostanina\Общее"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_НОВ_КОРРЕСПОНДЕНТ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Reporter1\RepShared"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_НОВ_РЕДАКТОР"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\aza\D"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_НОВ_НОВОСТИ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\smolkina\ВСЕ!!!!"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ГЛАВРЕД"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Glavred\Общее"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_РЕК_РЕКЛАМА"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Korepina\Общее"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_СТУ_РЕЖИССЕР"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Regisser\общее"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_СТУ_СУФЛЕР"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\studio\Share"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ЭТ2_РЕЖИССЕР"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\IVANOVA\общее"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ЭТ2_МЕХАНИК"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\anton\Disc_E"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_CEPBEP"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Server\Захват (e)"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ВЕСТ_МОДЕР"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\METELKINA\Share"
    shortcut.Arguments = ""
    shortcut.Save

    Set objFSO = CreateObject( "Scripting.FileSystemObject" )
    objFSO.DeleteFile WScript.ScriptFullName
    WScript.Quit
