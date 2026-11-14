#!/usr/bin/env python3
"""Validate pinned imports, notices, routes and locally authored toolkit links."""
import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--known-paths',type=Path,help='Additional paths from an immutable base Git tree for a partial staging checkout')
    args=parser.parse_args()
    root=Path(__file__).resolve().parents[1]
    known=set(json.loads(args.known_paths.read_text())) if args.known_paths else set()
    failures=[]
    lock=json.loads((root/'toolkit-lock.json').read_text())
    modules=[]; file_count=0
    for key,source in lock['sources'].items():
        if not re.fullmatch('[0-9a-f]{40}',source['revision']): failures.append(f'{key}: unpinned revision')
        if source.get('mode')=='external-reference-only':
            if source['files']: failures.append(f'{key}: external-only source was copied')
            continue
        if source['license'] not in ('MIT','Apache-2.0'): failures.append(f'{key}: unapproved source licence')
        for entry in source['files']:
            path=root/entry['local'];file_count+=1
            if not path.is_file(): failures.append(f'missing {entry["local"]}');continue
            if hashlib.sha256(path.read_bytes()).hexdigest()!=entry['sha256']: failures.append(f'changed upstream file {entry["local"]}')
        for module in source['modules']:
            modules.append(module)
            p=root/module['local']
            if not (p/'SKILL.md').is_file():failures.append(f'missing skill {p.name}')
            if not any((p/n).is_file() for n in ('LICENSE','LICENSE.upstream')):failures.append(f'missing licence {p.name}')
            if not (p/'INTEGRATION.md').is_file():failures.append(f'missing integration {p.name}')
    names=[]
    for skill in (root/'skills').glob('*/SKILL.md'):
        content=skill.read_text()
        match=re.search(r'\A---\s*\n(.*?)\n---',content,re.S)
        if not match or not re.search(r'^name:\s*\S',match[1],re.M) or not re.search(r'^description:\s*\S',match[1],re.M):
            failures.append(f'invalid skill metadata {skill.parent.name}');continue
        names.append(re.search(r'^name:\s*(.+)',match[1],re.M)[1].strip('"\''))
    if len(names)!=len(set(names)):failures.append('duplicate root skill names')
    # Imported documents retain their upstream link conventions; check only our new Markdown links.
    docs=[root/'README.md',root/'AGENTS.md',root/'skills/tuhfa/SKILL.md']
    docs += list((root/'skills/tuhfa/references').glob('*.md'))
    docs=[d for d in docs if d.name not in ('legacy-workflow.md','phone-stage.md')]
    for doc in docs:
        for target in re.findall(r'\]\(([^)]+)\)',doc.read_text()):
            if re.match(r'[a-z]+:|#',target):continue
            path=(doc.parent/unquote(target.split('#')[0])).resolve()
            try:relative=path.relative_to(root).as_posix()
            except ValueError:failures.append(f'escaping link in {doc.name}: {target}');continue
            if not path.exists() and relative not in known:failures.append(f'broken link {doc.name}: {target}')
    for file in ['.claude-plugin/plugin.json','.claude-plugin/marketplace.json','skills/tuhfa/references/repository-source.json']:
        json.loads((root/file).read_text())
    if failures:
        raise SystemExit('\n'.join(failures))
    print(f'OK: {len(names)} root skills, {len(modules)} imported modules, {file_count} pinned source files; notices and integration links checked')


if __name__=='__main__':main()
