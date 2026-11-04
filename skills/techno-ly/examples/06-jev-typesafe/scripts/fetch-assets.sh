#!/usr/bin/env bash
# Re-fetch the third-party images used in the Jev video (they are NOT committed: they belong to their owners).
# Run inside the project; writes public/img/. Needs: curl, python3 + Pillow + numpy.
set -e; mkdir -p public/img assets-raw; cd assets-raw
F=https://framerusercontent.com/images
curl -s $F/RtIGTDwO43jR4ZDilesXiR5znc.jpg -o og.jpg          # TypeSafe wordmark on pink (made transparent below)
curl -s $F/aNFzSFxM4fjICmnibw7npfZjcQ.png -o mark.png        # TypeSafe mark
curl -s $F/XN6JW6NCcucLj5WYWe3233CPsZM.webp -o diogo.webp    # typesafe.ai/team headshots
curl -s $F/rMb7eor2KJJLvZxmXnXsKlkDXo.webp -o erik.webp
curl -s $F/ACZcri6zeDjBNkfL19L22WF6N0k.webp -o sasha.webp
curl -sL "https://d1lamhf6l6yk6d.cloudfront.net/uploads/2025/06/Favicon-%E2%80%94-270x270px.png" -o a16z.png
curl -sL https://www.dcvc.com/dist/images/favicon/apple-touch-icon.png -o dcvc.png
python3 - <<'P'
from PIL import Image; import numpy as np
O='../public/img/'
og=Image.open('og.jpg').convert('RGB').crop((225,235,975,395)); a=np.asarray(og).astype(float); g=a[:,:,1]
al=np.clip((np.median(g[:10])-g)/(np.median(g[:10])-g.min())*1.35,0,1)
o=np.zeros(a.shape[:2]+(4,),np.uint8); o[:,:,:3]=(28,22,23); o[:,:,3]=(al*255).astype(np.uint8)
im=Image.fromarray(o,'RGBA'); im.crop(im.getbbox()).save(O+'typesafe-word.png')
Image.open('mark.png').convert('RGBA').save(O+'typesafe-mark.png')
for n in ['diogo','erik','sasha']: Image.open(n+'.webp').convert('RGB').resize((600,600),Image.LANCZOS).save(O+n+'.jpg',quality=90)
Image.open('a16z.png').convert('RGB').save(O+'a16z.png'); Image.open('dcvc.png').convert('RGB').save(O+'dcvc.png')
P
echo "wrote public/img/"
