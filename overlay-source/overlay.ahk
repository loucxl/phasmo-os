#Requires AutoHotkey v2.0

; =========================================================
; PHASMO TIMER OVERLAY
; =========================================================

global isRunning := false
global seconds := 0
global overlayMode := 1

; =========================================================
; GUI
; =========================================================

myGui := Gui("+AlwaysOnTop -Caption +ToolWindow")

myGui.BackColor := "000000"

myGui.SetFont("s28 Bold", "Segoe UI")

global timerText := myGui.AddText(
    "Center c00E5FF w320",
    "00:00"
)

myGui.SetFont("s14 Bold", "Segoe UI")

global statusText := myGui.AddText(
    "Center c00E5FF w320",
    "SAFE PERIOD"
)

myGui.SetFont("s10", "Segoe UI")

myGui.AddText(
    "Center c888888 w320",
    "F6 Start/Pause | F7 Reset | F8 Opacity | F10 Close"
)

; =========================================================
; WINDOW SETTINGS
; =========================================================

WinSetTransparent(255, myGui)

myGui.Show("x100 y100 NoActivate")

; DRAG WINDOW

OnMessage(0x201, WM_LBUTTONDOWN)

WM_LBUTTONDOWN(*) {

    PostMessage(0xA1, 2)

}

; =========================================================
; TIMER FUNCTIONS
; =========================================================

ToggleTimer(*) {

    global isRunning

    isRunning := !isRunning

}

ResetTimer(*) {

    global isRunning
    global seconds
    global timerText
    global statusText

    isRunning := false

    seconds := 0

    timerText.Text := "00:00"

    statusText.Text := "SAFE PERIOD"

    statusText.Opt("c00E5FF")

}

UpdateTimer() {

    global seconds
    global timerText
    global statusText

    mins := Floor(seconds / 60)
    secs := Mod(seconds, 60)

    timerText.Text := Format("{:02}:{:02}", mins, secs)

    ; =====================================================
    ; HUNT STATES
    ; =====================================================

    if (seconds < 60) {

        statusText.Text := "SAFE PERIOD"

        statusText.Opt("c00E5FF")

    }
    else if (seconds < 90) {

        statusText.Text := "DEMON CAN HUNT"

        statusText.Opt("cFF4444")

    }
    else if (seconds < 180) {

        statusText.Text := "NORMAL GHOSTS CAN HUNT"

        statusText.Opt("cFFAA00")

    }
    else {

        statusText.Text := "SPIRIT CAN HUNT"

        statusText.Opt("cAA66FF")

    }

}

Tick() {

    global isRunning
    global seconds

    if (isRunning) {

        seconds += 1

        UpdateTimer()

    }

}

; =========================================================
; OVERLAY MODES
; =========================================================

ChangeOverlayMode(*) {

    global overlayMode
    global myGui

    overlayMode += 1

    if (overlayMode > 3)
        overlayMode := 1

    ; ----------------------------------------
    ; MODE 1 - FULL
    ; ----------------------------------------

    if (overlayMode = 1) {

        WinSetTransparent(255, myGui)

        WinSetTransColor("Off", myGui)

    }

    ; ----------------------------------------
    ; MODE 2 - DIM
    ; ----------------------------------------

    else if (overlayMode = 2) {

        WinSetTransparent(120, myGui)

        WinSetTransColor("Off", myGui)

    }

    ; ----------------------------------------
    ; MODE 3 - TEXT ONLY
    ; ----------------------------------------

    else {

        WinSetTransparent(255, myGui)

        WinSetTransColor("000000", myGui)

    }

}

; =========================================================
; TIMER LOOP
; =========================================================

SetTimer(Tick, 1000)

; =========================================================
; HOTKEYS
; =========================================================

F6::ToggleTimer()

F7::ResetTimer()

F8::ChangeOverlayMode()

F10::ExitApp()
