!macro customInstall
    CreateShortCut "$SMSTARTUP\Studien-App.lnk" "$INSTDIR\Studien-App.exe"
!macroend

!macro customUnInstall
  Delete "$SMSTARTUP\Studien-App.lnk"
!macroend