import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1]/'skills/tuhfa/scripts/word_clock.py'
SPEC = importlib.util.spec_from_file_location('word_clock', SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class WordClockTests(unittest.TestCase):
    def test_arabic_repeat_ids_and_no_retiming(self):
        rows = [['جرّب', .15, .6], ['الآن', .7, 1.1], ['جرّب', 1.2, 1.8]]
        result = MODULE.build_clock(rows, 2)
        self.assertEqual(result['occurrences']['جرّب'], ['w0001', 'w0003'])
        self.assertEqual([(w['start'], w['end']) for w in result['words']], [(r[1], r[2]) for r in rows])

    def test_whisper_and_character_alignment(self):
        result = MODULE.build_clock({'segments':[{'words':[{'word':' مرحباً', 'start':0, 'end':.4}]}]})
        self.assertEqual(result['words'][0]['text'], 'مرحباً')
        data = {'characters':['أ','ه','ل','ا',' ','ب','ك'],
                'character_start_times_seconds':[0,.1,.2,.3,.4,.5,.6],
                'character_end_times_seconds':[.1,.2,.3,.4,.5,.6,.7]}
        result = MODULE.build_clock({'alignment':data}, .7)
        self.assertEqual([w['text'] for w in result['words']], ['أهلا', 'بك'])
        self.assertEqual(result['words'][1]['start'], .5)

    def test_rejects_guessed_phrase_and_bad_intervals(self):
        for data in [[], [['كلمة',-1,1]], [['كلمة',1,1]], [['كلمة',0,1],['أخرى',.5,2]],
                     [['كلمة',0,float('nan')]], [['جملة كاملة',0,2]], {'segments':[{'text':'عبارة','start':0,'end':1}]}]:
            with self.subTest(data=data), self.assertRaises(ValueError):
                MODULE.build_clock(data)
        with self.assertRaises(ValueError):
            MODULE.build_clock([['كلمة',0,3]], 2)


if __name__ == '__main__':
    unittest.main()
