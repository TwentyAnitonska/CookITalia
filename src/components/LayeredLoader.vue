<template>
  <span class="layered-loader" role="status" aria-label="Caricamento in corso">
    <img :src="load1" class="layered-loader__layer layered-loader__layer--1" alt="" />
    <img :src="load2" class="layered-loader__layer layered-loader__layer--2" alt="" />
    <img :src="load3" class="layered-loader__layer layered-loader__layer--3" alt="" />
    <img :src="load4" class="layered-loader__layer layered-loader__layer--4" alt="" />
  </span>
</template>

<script setup>
import load1 from '../assets/load 1.png'
import load2 from '../assets/load 2.png'
import load3 from '../assets/load 3.png'
import load4 from '../assets/load 4.png'
</script>

<style scoped>
.layered-loader {
  position: relative;
  display: inline-block;
  width: var(--layered-loader-size, 250px);
  height: var(--layered-loader-size, 250px);
  flex: 0 0 auto;
  vertical-align: middle;
}

.layered-loader__layer {
  position: absolute;
  /* Centratura assoluta rispetto al fulcro del contenitore */
  top: 50%;
  left: 50%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  /* Mantiene la centratura statica per i layer 1 e 3 */
  transform: translate(-50%, -50%);
}

.layered-loader__layer--1 { z-index: 10; }
.layered-loader__layer--2 { z-index: 20; }
.layered-loader__layer--3 { z-index: 30; }
.layered-loader__layer--4 { z-index: 40; }

.layered-loader__layer--2,
.layered-loader__layer--4 {
  /* Imposta il fulcro millimetrico che hai trovato per evitare l'oscillazione */
  transform-origin: 50.8% 50.5%;
  /* Sincronizzati perfettamente a 2s (o cambia a 1.2s se lo preferisci più veloce) */
  animation: layered-loader-spin 4s linear infinite;
}

/* L'animazione deve preservare il translate(-50%, -50%) per non spostare l'immagine */
@keyframes layered-loader-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>