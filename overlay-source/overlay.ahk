#Requires AutoHotkey v2.0

global running := false
global seconds := 0
global overlayMode := 1

; ==========================================
; GUI
; ==========================================

myGui := Gui("+AlwaysOnTop -Caption +ToolWindow")

myGui.BackColor := "0B1220"

myGui.SetFont("s12 Bold c00E5FF", "Segoe UI")

titleText := myGui.AddText("Center w320", "PHASMO-TIMER")

myGui.SetFont("s38 Bold cFFFFFF", "Segoe UI")

timerText := myGui.AddText("Center w320", "00:00")

myGui.SetFont("s12 Bold cFFAA00", "Segoe UI")

statusText := myGui.AddText("Center w320", "READY")

myGui.SetFont("s10 cAAAAAA", "Segoe UI")

helpText := myGui.AddText(
    "Center w320",
    "F6 Start/Pause | F7 Reset | F8 Mode | F10 Exit"
)

myGui.Show("w340 h190")

WinSetTransparent(255, myGui)

; ==========================================
; UPDATE TIMER
; ==========================================

UpdateTimer() {

    global seconds
    global timerText
    global statusText

    mins := Floor(seconds / 60)
    secs := Mod(seconds, 60)

    timerText.Text := Format("{:02}:{:02}", mins, secs)

    ; --------------------------------------
    ; STATES
    ; --------------------------------------

    if (seconds < 60) {

        statusText.Text := "DEMON CAN HUNT"

        statusText.Opt("cFF4444")

    }
    else if (seconds < 90) {

        statusText.Text := "NORMAL HUNT ACTIVE"

        statusText.Opt("cFFAA00")

    }
    else if (seconds < 180) {

        statusText.Text := "SPIRIT SAFE PERIOD"

        statusText.Opt("c00E5FF")

    }
    else {

        statusText.Text := "SPIRIT SAFE OVER"

        statusText.Opt("cAA66FF")

    }

}

; ==========================================
; TIMER LOOP
; ==========================================

Tick(*) {

    global running
    global seconds

    if (running) {

        seconds += 1

        UpdateTimer()

    }

}

SetTimer(Tick, 1000)

UpdateTimer()

; ==========================================
; HOTKEYS
; ==========================================

; START / PAUSE

F6:: {

    global running

    running := !running

}

; RESET

F7:: {

    global running
    global seconds

    running := false
    seconds := 0

    UpdateTimer()

}

; ==========================================
; OVERLAY MODES
; ==========================================

F8:: {

    global overlayMode
    global myGui
    global titleText
    global helpText
    global timerText
    global statusText

    overlayMode += 1

    if (overlayMode > 3)
        overlayMode := 1

    ; --------------------------------------
    ; MODE 1 = FULL
    ; --------------------------------------

    if (overlayMode = 1) {

        WinSetTransparent(255, myGui)

        myGui.BackColor := "0B1220"

        titleText.Visible := true
        helpText.Visible := true

    }

    ; --------------------------------------
    ; MODE 2 = DIMMED
    ; --------------------------------------

    else if (overlayMode = 2) {

        WinSetTransparent(120, myGui)

        myGui.BackColor := "0B1220"

        titleText.Visible := true
        helpText.Visible := true

    }

    ; --------------------------------------
    ; MODE 3 = TEXT ONLY
    ; --------------------------------------

    else {

        ; COMPLETELY TRANSPARENT WINDOW

        WinSetTransColor("0B1220 255", myGui)

        myGui.BackColor := "0B1220"

        ; Hide extra UI

        titleText.Visible := false
        helpText.Visible := false

    }

}

; ==========================================
; EXIT APP
; ==========================================

F10:: {

    ExitApp()

}

; ==========================================
; DRAG WINDOW
; ==========================================

OnMessage(0x201, WM_LBUTTONDOWN)

WM_LBUTTONDOWN(wParam, lParam, msg, hwnd) {

    PostMessage(0xA1, 2)

}