#!/usr/bin/env python3
"""Import supplied second-based word timings without inventing alignment."""
import argparse
import json
import math
from pathlib import Path


def number(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f'timestamp must be a finite number: {value!r}')
    return float(value)


def character_words(alignment):
    chars = alignment['characters']
    starts = alignment['character_start_times_seconds']
    ends = alignment['character_end_times_seconds']
    if not (len(chars) == len(starts) == len(ends)):
        raise ValueError('character alignment lengths differ')
    result, text, begin, finish, previous = [], '', None, None, 0.0
    for char, start, end in zip(chars, starts, ends):
        start, end = number(start), number(end)
        if not isinstance(char, str) or start < 0 or end < start or start + 1e-6 < previous:
            raise ValueError('invalid or overlapping character alignment')
        previous = end
        # Split even when an aligner puts more than one character in a token.
        # Internal whitespace in a token has no exact word boundary: require real alignment.
        if char.isspace():
            if text:
                result.append([text, begin, finish])
                text, begin, finish = '', None, None
        elif any(c.isspace() for c in char):
            raise ValueError('alignment token contains internal whitespace; supply character or word timings')
        else:
            if begin is None:
                begin = start
            text += char
            finish = end
    if text:
        result.append([text, begin, finish])
    return result


def rows_from(data):
    if isinstance(data, dict):
        for field in ('alignment', 'normalized_alignment'):
            if isinstance(data.get(field), dict):
                return character_words(data[field])
        if 'characters' in data:
            return character_words(data)
        if 'words' in data:
            return data['words']
        if 'segments' in data:
            if not data['segments'] or any(not s.get('words') for s in data['segments']):
                raise ValueError('segments need actual word timings; phrase boundaries cannot supply exact words')
            return [w for s in data['segments'] for w in s['words']]
    if isinstance(data, list):
        return data
    raise ValueError('expected word triples, words, segments.words, or character alignment')


def build_clock(data, duration=None):
    if duration is not None and number(duration) <= 0:
        raise ValueError('duration must be positive seconds')
    words, occurrences, previous = [], {}, 0.0
    rows = rows_from(data)
    if not isinstance(rows, list) or not rows:
        raise ValueError('no word timings provided')
    for i, row in enumerate(rows, 1):
        if isinstance(row, dict):
            text = row.get('word', row.get('text'))
            start, end = row.get('start'), row.get('end')
        elif isinstance(row, (list, tuple)) and len(row) == 3:
            text, start, end = row
        else:
            raise ValueError(f'invalid word row {i}')
        if not isinstance(text, str) or not text.strip():
            raise ValueError(f'empty or non-string word at {i}')
        text = text.strip()
        if any(c.isspace() for c in text):
            raise ValueError(f'row {i} contains multiple words; provide real per-word timings')
        start, end = number(start), number(end)
        if start < 0 or end <= start or start + 1e-6 < previous:
            raise ValueError(f'invalid or overlapping word interval at {i}: {start}..{end}')
        if duration is not None and end > duration + 1e-6:
            raise ValueError(f'word {i} exceeds audio duration {duration}')
        wid = f'w{i:04d}'
        words.append({'id': wid, 'text': text, 'start': start, 'end': end})
        occurrences.setdefault(text, []).append(wid)
        previous = end
    return {'schema': 1, 'timing': 'provided-timestamps', 'units': 'seconds',
            'duration': duration, 'words': words, 'occurrences': occurrences}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--duration', type=float)
    parser.add_argument('--format', choices=['clock', 'triples'], default='clock')
    args = parser.parse_args()
    try:
        clock = build_clock(json.loads(args.source.read_text(encoding='utf-8')), args.duration)
    except (ValueError, KeyError, TypeError) as error:
        parser.error(str(error))
    payload = clock if args.format == 'clock' else [[w['text'], w['start'], w['end']] for w in clock['words']]
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2, allow_nan=False)+'\n', encoding='utf-8')
    print(f"Imported {len(clock['words'])} words; last end {clock['words'][-1]['end']:.3f}s")


if __name__ == '__main__':
    main()
