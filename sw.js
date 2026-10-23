// Service worker do VemVerão: guarda o app no celular para abrir sem internet.
const CACHE = "vemverao-v1";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "Treino_Full_Body_Halteres.pdf",
  "icons/apple-touch-icon.png",
  "icons/favicon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "img/Arnold_Dumbbell_Press_0.jpg",
  "img/Arnold_Dumbbell_Press_1.jpg",
  "img/Barbell_Hip_Thrust_0.jpg",
  "img/Barbell_Hip_Thrust_1.jpg",
  "img/Bent_Over_Two-Dumbbell_Row_0.jpg",
  "img/Bent_Over_Two-Dumbbell_Row_1.jpg",
  "img/Crunches_0.jpg",
  "img/Crunches_1.jpg",
  "img/Dumbbell_Alternate_Bicep_Curl_0.jpg",
  "img/Dumbbell_Alternate_Bicep_Curl_1.jpg",
  "img/Dumbbell_Bench_Press_0.jpg",
  "img/Dumbbell_Bench_Press_1.jpg",
  "img/Dumbbell_Flyes_0.jpg",
  "img/Dumbbell_Flyes_1.jpg",
  "img/Dumbbell_Incline_Row_0.jpg",
  "img/Dumbbell_Incline_Row_1.jpg",
  "img/Dumbbell_Lunges_0.jpg",
  "img/Dumbbell_Lunges_1.jpg",
  "img/Dumbbell_Lying_Rear_Lateral_Raise_0.jpg",
  "img/Dumbbell_Lying_Rear_Lateral_Raise_1.jpg",
  "img/Dumbbell_Shoulder_Press_0.jpg",
  "img/Dumbbell_Shoulder_Press_1.jpg",
  "img/Flat_Bench_Lying_Leg_Raise_0.jpg",
  "img/Flat_Bench_Lying_Leg_Raise_1.jpg",
  "img/Goblet_Squat_0.jpg",
  "img/Goblet_Squat_1.jpg",
  "img/Hammer_Curls_0.jpg",
  "img/Hammer_Curls_1.jpg",
  "img/Incline_Dumbbell_Curl_0.jpg",
  "img/Incline_Dumbbell_Curl_1.jpg",
  "img/Incline_Dumbbell_Press_0.jpg",
  "img/Incline_Dumbbell_Press_1.jpg",
  "img/Kettlebell_One-Legged_Deadlift_0.jpg",
  "img/Kettlebell_One-Legged_Deadlift_1.jpg",
  "img/Lying_Dumbbell_Tricep_Extension_0.jpg",
  "img/Lying_Dumbbell_Tricep_Extension_1.jpg",
  "img/One-Arm_Dumbbell_Row_0.jpg",
  "img/One-Arm_Dumbbell_Row_1.jpg",
  "img/Plank_0.jpg",
  "img/Plank_1.jpg",
  "img/Side_Lateral_Raise_0.jpg",
  "img/Side_Lateral_Raise_1.jpg",
  "img/Split_Squat_with_Dumbbells_0.jpg",
  "img/Split_Squat_with_Dumbbells_1.jpg",
  "img/Standing_Dumbbell_Calf_Raise_0.jpg",
  "img/Standing_Dumbbell_Calf_Raise_1.jpg",
  "img/Standing_Dumbbell_Triceps_Extension_0.jpg",
  "img/Standing_Dumbbell_Triceps_Extension_1.jpg",
  "img/Stiff-Legged_Dumbbell_Deadlift_0.jpg",
  "img/Stiff-Legged_Dumbbell_Deadlift_1.jpg",
  "img/Straight-Arm_Dumbbell_Pullover_0.jpg",
  "img/Straight-Arm_Dumbbell_Pullover_1.jpg",
  "img/Tricep_Dumbbell_Kickback_0.jpg",
  "img/Tricep_Dumbbell_Kickback_1.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Página: tenta a rede primeiro (pega atualizações), sem internet usa a cópia salva.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return res; })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  // Fontes do Google: usa a cópia salva e atualiza em segundo plano.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(CACHE).then(c => c.match(req).then(hit => {
        const net = fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
    return;
  }

  // Fotos, PDF e ícones: cópia salva primeiro.
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
  }
});
