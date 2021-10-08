' Ñîçäàòü ñåòåâûå ÿğëûêè  (è óäàëèòü ñåáÿ)
Dim FileName, scriptdir
    scriptdir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

    FileName = "_ÊÓĞ_ÇÂÓÊÎĞÅÆÈÑÑÅĞ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\xrebtova\Ìîíòàæ çâóêà"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÊÓĞ_ÌÅÕÀÍÈÊ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\MIKHEEV\Çàõâàò"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÊÓĞ_ÊÎĞĞÅÑÏÎÍÄÅÍÒ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Ostanina\Îáùåå"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÍÎÂ_ÊÎĞĞÅÑÏÎÍÄÅÍÒ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Reporter1\RepShared"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÍÎÂ_ĞÅÄÀÊÒÎĞ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\aza\D"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÍÎÂ_ÍÎÂÎÑÒÈ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\smolkina\ÂÑÅ!!!!"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÃËÀÂĞÅÄ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Glavred\Îáùåå"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ĞÅÊ_ĞÅÊËÀÌÀ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Korepina\Îáùåå"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÑÒÓ_ĞÅÆÈÑÑÅĞ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Regisser\îáùåå"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÑÒÓ_ÑÓÔËÅĞ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\studio\Share"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_İÒ2_ĞÅÆÈÑÑÅĞ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\IVANOVA\îáùåå"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_İÒ2_ÌÅÕÀÍÈÊ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\anton\Disc_E"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_CEPBEP"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Server\Çàõâàò (e)"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_ÂÅÑÒ_ÌÎÄÅĞ"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\METELKINA\Share"
    shortcut.Arguments = ""
    shortcut.Save

    Set objFSO = CreateObject( "Scripting.FileSystemObject" )
    objFSO.DeleteFile WScript.ScriptFullName
    WScript.Quit
