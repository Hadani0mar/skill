"""Shared paths. Assets live in the skill; per-film output goes to PRESENTER_WORK (default ./presenter-work)."""
import os
from pathlib import Path
SKILL = Path(__file__).resolve().parents[1]
ASSETS = SKILL / 'assets'
# Two looks of the same host: holding a laptop (default) or a phone.
# crop = LivePortrait face box in the 736 px source; clawd = Clawd's feet on the shoulder (source px).
VARIANTS = {
    'laptop': dict(char='character.jpg', posebank='posebank', crop=(148, 70, 588, 510), clawd=(170, 438)),
    'phone': dict(char='character-phone.jpg', posebank='posebank-phone', crop=(136, 10, 616, 490), clawd=(185, 438),
                  protect=[(286, 428, 462, 736)]),   # the phone stays untouched
}
VARIANT = os.environ.get('PRESENTER_VARIANT', 'laptop')
V = VARIANTS[VARIANT]
CHAR = ASSETS / V['char']
POSEBANK = ASSETS / V['posebank']
FACE_CROP = V['crop']
CLAWD_FEET = V['clawd']
PROTECT = V.get('protect', [])
SFX = ASSETS / 'sfx'
FONT_AR = ASSETS / 'fonts' / 'Lalezar-Regular.ttf'
FONT_LAT = ASSETS / 'fonts' / 'Vazirmatn-VF.ttf'
WORK = Path(os.environ.get('PRESENTER_WORK', 'presenter-work')).resolve()
SCREEN_FRAMES = Path(os.environ.get('SCREEN_FRAMES', WORK / 'screen-frames'))
LIVEPORTRAIT = os.environ.get('LIVEPORTRAIT', str(Path.home() / 'LivePortrait'))
