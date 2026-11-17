#!/usr/bin/env python3
"""Build sample-accurate voice cues and an RMS mouth clock for Remotion."""
import glob
import json
import math
import os
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent
AUD = ROOT / "public" / "audio"
SRC = ROOT / "src"
FPS = 60

LINES = [
    ("A", "تشوف الرقم خمسة؟ الكمبيوتر يكتبه بصفر وواحد بس!"),
    ("B", "بالضبط، ونوريك كيف. أول حاجة: الصفر يعني طافي، والواحد يعني شغّال."),
    ("A", "يعني زي مفتاح الضو؟"),
    ("B", "إيه. وتوّا عندنا أربع خانات، قيمهن: ثمانية، أربعة، اثنين، وواحد."),
    ("A", "باهي، كيف نكتب خمسة؟"),
    ("B", "نشغّل الأربعة والواحد، ونطفّوا الباقي. يطلع صفر، واحد، صفر، واحد. أربعة زايد واحد يساوي خمسة!"),
]

def prepare_one(index, actor):
    name = f"{index:02d}-{actor}.wav"
    path = AUD / name
    if not path.exists():
        parts = sorted(glob.glob(str(path) + ".part*"))
        if not parts:
            raise FileNotFoundError(f"Missing voice recording: {path}")
        with open(path, "wb") as out:
            for part in parts:
                with open(part, "rb") as source:
                    out.write(source.read())
    with wave.open(str(path), "rb") as wav:
        rate = wav.getframerate()
        channels = wav.getnchannels()
        width = wav.getsampwidth()
        frames = wav.getnframes()
        assert channels == 1 and width == 2, f"Unexpected WAV {name}: {channels=} {width=}"
        data = wav.readframes(frames)
    samples = struct.unpack("<" + "h" * (len(data) // 2), data)
    hop = rate / FPS
    duration_frames = int(math.ceil((frames / rate) * FPS))
    env = []
    for frame in range(duration_frames):
        start = int(frame * hop)
        end = min(len(samples), int((frame + 1) * hop))
        portion = samples[start:end] or [0]
        value = math.sqrt(sum(v*v for v in portion)/len(portion))/32768.0
        env.append(value)
    scale = max(0.08, sorted(env)[int(len(env) * 0.92)])
    env = [round(min(1.0, (v/scale)**0.65), 3) for v in env]
    return name, duration_frames, env

def foley(name, frequency=370, ms=90, amp=0.16):
    rate = 24000
    n = int(rate * ms / 1000)
    with wave.open(str(AUD/name), "wb") as file:
        file.setnchannels(1); file.setsampwidth(2); file.setframerate(rate)
        buf = bytearray()
        for i in range(n):
            t = i/rate
            env = (1-i/n)**2 * (1-math.exp(-i/20))
            v = math.sin(math.tau*frequency*t) * env
            v += 0.22*math.sin(math.tau*frequency*2.8*t)*env
            buf.extend(struct.pack("<h",int(max(-1,min(1,v*amp))*32767)))
        file.writeframes(bytes(buf))

def main():
    AUD.mkdir(parents=True,exist_ok=True)
    SRC.mkdir(parents=True,exist_ok=True)
    timeline = []
    frame = 0
    for i, (actor,text) in enumerate(LINES):
        filename,duration,env = prepare_one(i,actor)
        timeline.append({"i":i,"speaker":actor,"text":text,"file":filename,"start":frame,"duration":duration,"end":frame+duration,"mouth":env})
        frame += duration + 22 # silence between turns, 367 ms
    foley("soft-click.wav",430,95,0.15)
    foley("soft-press.wav",140,125,0.20)
    total = frame + 210 # 3.5 s for channel outro
    obj = {"fps":FPS,"totalFrames":total,"segments":timeline,"outroStart":frame}
    with open(SRC/"timeline.json","w",encoding="utf-8") as dest:
        json.dump(obj,dest,ensure_ascii=False,separators=(",",":"))
    with open(ROOT/"voice-timing.json","w",encoding="utf-8") as dest:
        json.dump({"fps":FPS,"segments":[{k:v for k,v in s.items() if k!="mouth"} for s in timeline],"totalFrames":total},dest,ensure_ascii=False,indent=2)
    print(json.dumps({"duration_seconds":round(total/FPS,2),"segments":len(timeline),"total_frames":total},ensure_ascii=False))

if __name__ == "__main__":
    main()
