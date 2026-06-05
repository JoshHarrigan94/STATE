# STATE

# STATE V1

STATE V1 is a static GitHub Pages prototype for a face-only behavioural signal engine.

## Purpose

The goal of V1 is not to diagnose, label, or predict a user's mental state.

The goal is to prove that a browser-based camera can extract stable behavioural signals from the face.

## Current Build Stage

Pass 9: Smoothing and calibration visibility.

## Core Pipeline

Camera  
→ MediaPipe Face Landmarker  
→ Face landmarks  
→ Eye openness  
→ Blink detection  
→ Head tilt  
→ Head stability  
→ Face size  
→ Blendshape activity  
→ Expression variability  
→ Rolling feature window  
→ Signal smoothing  
→ Signal quality  
→ Confidence  

## Current Signals

- Eye openness
- Blink rate
- Blink duration
- Head stability
- Head tilt
- Face size
- Expression variability

## Diagnostics

- Camera status
- Vision engine status
- Face detected / searching
- Frames processed
- Signal quality
- Confidence
- Quality notes
- Rolling window duration
- Smoothing alpha
- Samples in active window

## Important Boundary

STATE V1 does not perform emotion detection.

Expression variability means:

> the amount of visible facial change over time

It does not mean happy, sad, angry, stressed, depressed, or anxious.

## Deployment

This project is designed to run directly through GitHub Pages using `index.html`.

No build step.  
No npm.  
No backend.

## Important Limitations

STATE V1 is a behavioural signal prototype only.

It does not provide medical, mental health, diagnostic, or clinical conclusions.