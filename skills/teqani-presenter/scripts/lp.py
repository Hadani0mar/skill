"""LivePortrait parametric driver (no driving video): eyes, gaze, blink, mouth, head pose.
Expression offsets follow ComfyUI-AdvancedLivePortrait's calc_fe."""
import os, sys, numpy as np, cv2, torch
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import LIVEPORTRAIT, CHAR, WORK, FACE_CROP, PROTECT
sys.path.insert(0, LIVEPORTRAIT)
from src.config.inference_config import InferenceConfig
from src.live_portrait_wrapper import LivePortraitWrapper
from src.utils.camera import get_rotation_matrix

torch.set_num_threads(2)
CROP = FACE_CROP                      # x0, y0, x1, y1 in the 736px source (per variant)


class Face:
    def __init__(self, src_rgb):
        cfg = InferenceConfig(); cfg.flag_force_cpu = True; cfg.flag_use_half_precision = False
        self.w = LivePortraitWrapper(cfg)
        self.src = src_rgb
        x0, y0, x1, y1 = CROP
        crop = src_rgb[y0:y1, x0:x1]
        I = self.w.prepare_source(cv2.resize(crop, (256, 256), interpolation=cv2.INTER_AREA))
        self.f_s = self.w.extract_feature_3d(I)
        self.info = self.w.get_kp_info(I)
        self.x_s = self.w.transform_keypoint(self.info)
        n = x1 - x0; nh = y1 - y0
        m = np.zeros((nh, n), np.float32)
        b = int(n * .1); cv2.rectangle(m, (b, b), (n - b, nh - b), 1, -1)
        for (a, b, c, d) in PROTECT:                       # keep these source regions (e.g. the phone) untouched
            cv2.rectangle(m, (a - x0 - 8, b - y0 - 8), (c - x0 + 8, d - y0 + 8), 0, -1)
        self.mask = cv2.GaussianBlur(m, (0, 0), n * .03)[..., None]

    @staticmethod
    def fe(e, eyes=0, pupil_x=0, pupil_y=0, mouth=0, eee=0, woo=0, smile=0, eyebrow=0):
        rp = 0.
        e[0, 20, 1] += smile * -0.01; e[0, 14, 1] += smile * -0.02; e[0, 17, 1] += smile * 0.0065
        e[0, 17, 2] += smile * 0.003; e[0, 13, 1] += smile * -0.00275; e[0, 16, 1] += smile * -0.00275
        e[0, 3, 1] += smile * -0.0035; e[0, 7, 1] += smile * -0.0035
        e[0, 19, 1] += mouth * 0.001; e[0, 19, 2] += mouth * 0.0001; e[0, 17, 1] += mouth * -0.0001
        rp -= mouth * 0.05
        e[0, 20, 2] += eee * -0.001; e[0, 20, 1] += eee * -0.001; e[0, 14, 1] += eee * -0.001
        e[0, 14, 1] += woo * 0.001; e[0, 3, 1] += woo * -0.0005; e[0, 7, 1] += woo * -0.0005
        e[0, 17, 2] += woo * -0.0005
        if pupil_x > 0:
            e[0, 11, 0] += pupil_x * 0.0007; e[0, 15, 0] += pupil_x * 0.001
        else:
            e[0, 11, 0] += pupil_x * 0.001; e[0, 15, 0] += pupil_x * 0.0007
        e[0, 11, 1] += pupil_y * -0.001; e[0, 15, 1] += pupil_y * -0.001
        eyes -= pupil_y / 2.
        e[0, 11, 1] += eyes * -0.001; e[0, 13, 1] += eyes * 0.0003; e[0, 15, 1] += eyes * -0.001
        e[0, 16, 1] += eyes * 0.0003; e[0, 1, 1] += eyes * -0.00025; e[0, 2, 1] += eyes * 0.00025
        if eyebrow > 0:
            e[0, 1, 1] += eyebrow * 0.001; e[0, 2, 1] += eyebrow * -0.001
        else:
            e[0, 1, 0] += eyebrow * -0.001; e[0, 2, 0] += eyebrow * 0.001
            e[0, 1, 1] += eyebrow * 0.0003; e[0, 2, 1] += eyebrow * -0.0003
        return rp

    def render(self, pitch=0, yaw=0, roll=0, **ex):
        """Returns the full 736px frame with the edited face pasted back."""
        inf = self.info
        e = inf['exp'].clone()
        rp = self.fe(e, **ex)
        R = get_rotation_matrix(inf['pitch'] + pitch + rp, inf['yaw'] + yaw, inf['roll'] + roll)
        x_d = inf['scale'][..., None] * (inf['kp'] @ R + e)
        x_d[:, :, 0:2] += inf['t'][:, None, 0:2]
        x_d = self.w.stitching(self.x_s, x_d)
        out = self.w.warp_decode(self.f_s, self.x_s, x_d)
        img = self.w.parse_output(out['out'])[0]
        x0, y0, x1, y1 = CROP
        face = cv2.resize(img, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA).astype(np.float32)
        full = self.src.astype(np.float32).copy()
        full[y0:y1, x0:x1] = full[y0:y1, x0:x1] * (1 - self.mask) + face * self.mask
        return full


if __name__ == '__main__':
    import time
    src = cv2.imread(str(CHAR))[:, :, ::-1].copy()
    f = Face(src)
    tests = [dict(), dict(eyes=-15), dict(eyes=5), dict(pupil_y=-12), dict(pupil_y=12),
             dict(pitch=-10), dict(pitch=10), dict(mouth=40), dict(mouth=80), dict(pitch=8, pupil_y=-10)]
    tiles = []
    for k, t in enumerate(tests):
        t0 = time.time(); im = f.render(**t); print(k, t, round(time.time() - t0, 2), 's')
        tile = im[60:520, 150:590].astype(np.uint8)
        cv2.putText(tile, str(k), (10, 40), 0, 1.2, (255, 255, 0), 3)
        tiles.append(cv2.resize(tile, (300, 314)))
    sheet = np.vstack([np.hstack(tiles[:5]), np.hstack(tiles[5:])])
    cv2.imwrite(str(WORK / 'lp_test.jpg'), sheet[:, :, ::-1])
