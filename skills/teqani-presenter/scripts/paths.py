"""Shared paths. Assets live in the skill; per-film output goes to PRESENTER_WORK (default ./presenter-work)."""
import os
from pathlib import Path
SKILL = Path(__file__).resolve().parents[1]
ASSETS = SKILL / 'assets'
CHAR = ASSETS / 'character.jpg'
POSEBANK = ASSETS / 'posebank'
SFX = ASSETS / 'sfx'
FONT_AR = ASSETS / 'fonts' / 'Lalezar-Regular.ttf'
FONT_LAT = ASSETS / 'fonts' / 'Vazirmatn-VF.ttf'
WORK = Path(os.environ.get('PRESENTER_WORK', 'presenter-work')).resolve()
SCREEN_FRAMES = Path(os.environ.get('SCREEN_FRAMES', WORK / 'screen-frames'))
LIVEPORTRAIT = os.environ.get('LIVEPORTRAIT', str(Path.home() / 'LivePortrait'))
