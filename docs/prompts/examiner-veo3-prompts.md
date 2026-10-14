# Spécifications & Prompts 1:1 Flow / Veo 3.1 — Examinateur Officiel M. Laurent

**Document de référence vidéo & animation IA**  
**Plateforme :** Super4C2 — Simulateur TCF Canada Officiel  
**Personnage :** M. Laurent Mercier — Examinateur Certifié France Éducation International (FEI)  
**Moteur de génération :** Google Flow / Veo 3.1 / Midjourney v6.1  
**Destination des rendus :**  
- `public/brand/examiner/examiner_idle.mp4` (Boucle d'attente / écoute attentive)  
- `public/brand/examiner/examiner_speaking.mp4` (Boucle de parole / explications et mime articulatoire)  

---

## 1. Prompt 1:1 — Génération de l'Image de Référence Clé (Keyframe)

Ce prompt sert à générer le portrait maître photographique 1:1 (ou image de départ pour la fonction *Image-to-Video* de Flow/Veo 3.1) garantissant une ressemblance et une cohérence faciale absolue.

```text
Photorealistic 1:1 medium close-up portrait of M. Laurent Mercier, a distinguished 45-year-old French certified oral examiner for France Éducation International. He has neat salt-and-pepper hair, warm intelligent hazel eyes behind slim dark-rimmed modern spectacles, and a subtle benevolent, attentive expression. He wears an impeccably tailored navy blue blazer over a crisp light-blue collared shirt, open at the collar without a tie. Positioned in a sleek, softly lit official French academic examination office with subtle wood paneling, official certificates on the background wall softly out of focus, and a clean professional desk. Neutral soft daylight from a side window balanced with warm 3200K key light, cinematic shallow depth of field, 85mm prime lens, f/2.0 aperture, hyper-realistic skin texture, 8k resolution, raw photo aesthetic.
```

---

## 2. Animation Prompt 1 — Boucle d'Attente & Écoute Attentive (Idle Loop)

> **Rôle dans l'application :** Joué en boucle continue (`loop`) lorsque le candidat réfléchit ou s'exprime. L'examinateur écoute avec attention, respect et bienveillance.  
> **Durée recommandée :** 6 à 8 secondes (boucle transparente).  
> **Structure en 6 parties (Directorial Command Engine — Veo 3.1) :**

```text
[1. Shot type & lens]
Medium close-up shot, 85mm portrait lens, shallow depth of field, sharp focus on the examiner's eyes.

[2. Subject & action]
M. Laurent Mercier, a distinguished 45-year-old French examiner with salt-and-pepper hair and glasses, listens attentively in silence. He performs subtle natural human micro-movements: gentle blinking at a realistic human interval, slight organic breathing visible in the chest and shoulders, and a minimal, encouraging micro-nod of the head every four seconds while keeping steady, supportive eye contact directly toward the camera lens. His lips remain closed in a calm, welcoming listening posture.

[3. Environment & setting]
Official, modern French examination room interior. Warm wooden desk surface in the foreground, soft blurred background showing academic bookshelves and neutral beige walls.

[4. Lighting]
Soft directional key light from camera-left at 45 degrees, gentle fill light on camera-right eliminating harsh shadows, warm ambient rim light separating his shoulders from the dark background.

[5. Camera movement]
Completely static tripod lock-off camera with zero shake or drift, maintaining perfect composition for seamless looping.

[6. Audio]
Subtle indoor room tone, faint paper rustle, soft distant air circulation, zero speech, zero music.
```

---

## 3. Animation Prompt 2 — Boucle de Parole & Mime Explicatif (Speaking Loop)

> **Rôle dans l'application :** Déclenché automatiquement lorsque l'examinateur énonce une consigne ou pose une question (synchronisé avec l'audio de M. Laurent).  
> **Durée recommandée :** 6 à 8 secondes (boucle transparente).  
> **Structure en 6 parties (Directorial Command Engine — Veo 3.1) :**

```text
[1. Shot type & lens]
Medium close-up shot, 85mm cinema lens, f/2.2 aperture, sharp subject isolation against soft background.

[2. Subject & action]
M. Laurent Mercier speaks naturally and articulately in professional French cadence. Realistic, physics-grounded jaw and lip movements synchronizing with speech phrasing, expressive natural facial cadence, friendly eye crinkles, and subtle pedagogical head movements. He gently raises his right hand into lower frame in an open palm explanatory gesture, nodding gently to emphasize key instructions, before resting his hand back on the desk. High-fidelity lip-sync miming, natural mouth openings and closings without exaggeration.

[3. Environment & setting]
Same official French examination office, professional desk setting, certified exam atmosphere.

[4. Lighting]
High-end studio three-point lighting, soft diffuse key light illuminating his face, crisp catchlights in his eyes, warm rim light outlining his navy blazer.

[5. Camera movement]
Static camera on steady tripod, subtle organic depth, no zoom or pan to ensure seamless looping alignment with the idle clip.

[6. Audio]
Soft professional studio acoustic ambiance, natural breathing pauses between phrases, zero background music.
```

---

## 4. Instructions de Déploiement dans le Projet

1. Générer les deux clips vidéo via **Google Flow** (Veo 3.1) en utilisant les prompts ci-dessus (ou la fonction *Image-to-Video* à partir de `public/brand/examiner-laurent.jpg`).
2. Exporter les vidéos en format **MP4 (H.264 / 1080p ou 720p, 30fps)**.
3. Remplacer les fichiers dans le dossier du projet :
   - Boucle d'attente : `public/brand/examiner/examiner_idle.mp4`
   - Boucle de parole : `public/brand/examiner/examiner_speaking.mp4`
4. L'application Super4C2 gère déjà la transition ultra-fluide avec crossfade d'opacité, la détection synchrone de la voix de l'examinateur, et un fallback automatique sur photo haute définition sans aucun écran noir.
